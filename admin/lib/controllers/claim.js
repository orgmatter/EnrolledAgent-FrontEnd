const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    EmailTemplates,
    MailService,
    Constants,
    Helper,
    Logger,
    DB,
    Models: { Agent, ClaimListing, User },
} = require("common")
const {Types} = require("mongoose")

const BaseController = require('../controllers/baseController');
const STORAGE = process.env.STORAGE
const log = new Logger("App:claim");

class ClaimController extends BaseController {

    async approveClaim(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid agent id', req, res, next)) return

        if (!Validator.isMongoId(id)) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid claim request id',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let claim = await ClaimListing.findById(id).exec()

        if (!claim) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid claim request id',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!claim.user || !Validator.isMongoId(String(claim.user))) {
            res.status(422)
            return next(
                new Exception(
                    'This claim request is not attached to a valid user',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!claim.agent || !Validator.isMongoId(String(claim.agent))) {
            res.status(422)
            return next(
                new Exception(
                    'This claim request does not reference a valid agent',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (await Agent.exists({ owner: claim.user })) {
            res.status(422)
            return next(
                new Exception(
                    'This user has previously claimed a listing',
                    ErrorCodes.REQUIRED
                )
            )
        }


        claim = await ClaimListing.findByIdAndUpdate(id, { status: Constants.ARTICLE_STATUS.approved },
            { new: true })

        Agent.findByIdAndUpdate(claim.agent, { owner: claim.user }).exec()

        super.handleResult({ message: 'Listing request approved succesfully' }, res, next)

        //Send user mail informing them of approval
        let user = await User.findById(claim.user)
        log.info(" sending mail");

        new MailService().sendMail(
            {
              
              template: EmailTemplates.INFO,
              reciever: user.email || process.env.DEFAULT_EMAIL_SENDER,
              subject: 'Account Approved',
              locals: {
                message: `
              <p>Congratulations,  </p>
              <p>Your account has been claimed successfully, you can now edit your profile.</p><br>
              <p></p>
              `},
            },
            (res) => {
              if (res == null) return
              log.error("Error sending mail", res)
            }
          )
    }


    async rejectClaim(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid agent id', req, res, next)) return

        const claim = await ClaimListing.findByIdAndUpdate(id, { status: Constants.ARTICLE_STATUS.rejected },
            { new: true })

        await Agent.findOneAndUpdate({ owner: Types.ObjectId(claim.user), },{owner: null }, {new: true}).exec()

        super.handleResult({ message: 'Listing request rejected succesfully' }, res, next)
    }


    // async delete(req, res, next) {
    //     const { id } = req.params
    //     if (!BaseController.checkId('Invalid agent id', req, res, next)) return

    //     let agent = await Agent.findByIdAndDelete(id).exec()
    //     if (agent && agent.imageUrl) FileManager.deleteFile(agent.imageUrl)
    //     super.handleResult(agent, res, next)
    // }

    async get(req, res, next) {
        const { id } = req.params

        if (!BaseController.checkId('Invalid agent id', req, res, next)) return
        let agent = await Agent.findById(id).exec()

        super.handleResult(agent, res, next)

    }



    async get(req, res, next) {
        const { id } = req.params
        let resource = await ClaimListing.findById(id)
            .populate([
                { path: 'user', select: { firstName: 1, lastName: 1, email: 1 } },
                { path: 'agent', select: { firstName: 1, lastName: 1, email: 1 } }])
            .exec()


        super.handleResult(resource, res, next)
    }



    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { jobRole: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, ClaimListing, {
            perPage: perpage,
            query,
            page,
            sort: { createdAt: -1 },
            populate: [
                { path: 'user', select: { firstName: 1, lastName: 1, email: 1 } },
                { path: 'agent', select: { firstName: 1, lastName: 1, email: 1 } }]
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })
    }
}

module.exports = new ClaimController()
//TODO: Dispatch email when listing is rejected