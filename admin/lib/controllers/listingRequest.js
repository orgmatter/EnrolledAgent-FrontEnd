const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    ErrorMessage,
    Helper,
    Constants,
    DB,
    LogAction,
    LogCategory,
    Models: { ListingRequest, Log, Agent },
} = require("common");
const mongoose = require("mongoose");



const sanitizeBody = (body) => {
    delete body.status
    body[''] = ''
    return body
}


const BaseController = require('../controllers/baseController');

class LoistingRequestController extends BaseController {




    // async delete(req, res, next) {
    //     const { id } = req.params
    //     if (!BaseController.checkId('Invalid article id', req, res, next)) return

    //     let resource = await ListingRequest.findByIdAndDelete(id).exec()
    //     if (resource && resource.imageUrl) FileManager.deleteFile(resource.imageUrl)
    //     super.handleResult(resource, res, next)
    //     await Log.create({
    //         user: req.user.id,
    //         action: LogAction.ARTICLE_DELETED,
    //         category: LogCategory.ARTICLE,
    //         resource: resource._id,
    //         ip: Helper.getIp(req),
    //         message: 'ListingRequest deleted'
    //     })
    // }

    async approve(req, res, next) {
        const { params: {  id } } = req

        if (!BaseController.checkId('Invalid request id', req, res, next)) return

        let request = await ListingRequest.findById(id).populate(['user'])

        if (!request) return next(
            new Exception(
                'invalid request',
                ErrorCodes.NO_PRIVILEGE
            )
        )

        if (!request.user) return next(
            new Exception(
                'This listing request is not attached to a valid user account',
                ErrorCodes.NO_PRIVILEGE
            )
        )

        
        if(await Agent.exists({owner: request.user._id}))
        return next(
            new Exception(
                'This user has previously claimed a listing',
                ErrorCodes.NO_PRIVILEGE
            )
        )

        if(await Agent.exists({email: request.email}))
        return next(
            new Exception(
                'An agent listing with the given email already exists',
                ErrorCodes.NO_PRIVILEGE
            )
        )

        const r = request.toJSON()
        delete r._id

        const a = await Agent.create({...r, owner : mongoose.Types.ObjectId(request.user._id)})
        

       await Agent.findByIdAndUpdate(a._id, {owner: request.user._id}, {new: true}).exec()

        request.status = Constants.ARTICLE_STATUS.approved
        request.agent = a._id
        console.log(request, a, b)

        await request.save() 


        super.handleResult({message: 'Listing request approved succesfully' }, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.APPROVE_LISTING_REQUEST,
            category: LogCategory.ARTICLE,
            resource: request._id,
            ip: Helper.getIp(req),
            message: 'Listing Request approved'
        })
    }

    async reject(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid request id', req, res, next)) return

        const claim = await ListingRequest.findByIdAndUpdate(id, { status: Constants.ARTICLE_STATUS.rejected },
            { new: true })

        super.handleResult({message: 'Listing request rejected succesfully' }, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.REJECT_LISTING_REQUEST,
            category: LogCategory.ARTICLE,
            resource: claim._id,
            ip: Helper.getIp(req),
            message: 'ListingRequest rejected'
        })
    }


    async get(req, res, next) {
        const { id } = req.params
        let resource = await ListingRequest.findById(id)
            .populate([{path: 'user', select: { firstName: 1, lastName: 1, email: 1}}])
            .exec()
        super.handleResult(resource, res, next)
    }



    async getAll(req, res, next) {
        const { page, perpage, q } = req.query
        let query = Helper.extractQuery(req.query, ['status', 'firstName', 'lastName', 'zipcode', 'city', 'state', 'licence', ]) || {}
        // let query = {agent: {$exists: false}} //Helper.extractQuery(req.query, ['title', 'message']) || {}
        // if (q) query = { $text: { $search: q } }

        DB.Paginate(res, next, ListingRequest, {
            perPage: perpage,
            query,
            page,
            sort: {createdAt: -1},
            populate: [{path: 'user', select: { firstName: 1, lastName: 1, email: 1}}]
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new LoistingRequestController()