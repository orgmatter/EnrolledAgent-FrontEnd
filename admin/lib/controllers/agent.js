const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Agent },
} = require("common")

const BaseController = require('../controllers/baseController');

class AgentController extends BaseController {
    sanitizeBody(body){
        delete body.rating
        return body
    }
    async create(req, res, next) {
        const { firstName, lastName, city, state,
            zipcode, country, phone, bio,
            address1,
            address2,
            address3, } = req.body

        if (!firstName || !lastName || !state) {
            res.status(422)
            return next(
                new Exception(
                    'Agent\'s first name, last name, and state are required',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let agent = await Agent.create({
            firstName, lastName, city, state,
            zipcode, country, phone, bio,
            address1,
            address2,
            address3,
        })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.AGENT_PROFILE,
                req.file
            )
            agent.imageUrl = imageUrl
            await agent.save()
        }
        super.handleResult(agent, res, next)

    }


    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid agent id', req, res, next)) return

        const body = sanitizeBody(req.body)

        let agent = await Agent.findByIdAndUpdate(id, body, { new: true })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.AGENT_PROFILE,
                req.file
            )
            if (agent.imageUrl && imageUrl) FileManager.deleteFile(agent.imageUrl)

            agent.imageUrl = imageUrl
            await agent.save()
        }
        super.handleResult(agent, res, next)

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

        super.handleResult(agent.toJSON(), res, next)

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search } }

        // query = {}

        DB.Paginate(res, next, Agent, {
            perPage: perpage,
            query,
            page,
            populate: [{ path: 'reviewCount', select: ['rating'] }, { path: 'owner', select: ['_id', 'firstName'] }]
        }, (data) => {
            req.locals.agents = data
            // console.log(data)
            next()
        })

    }
}

module.exports = new AgentController()