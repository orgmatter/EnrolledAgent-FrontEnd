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

    async get(req, res, next) {
        const { id } = req.params
        const agent = await Agent.findById(id).exec()

        res.locals.agent = agent

        next()

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Agent, {
            perPage: perpage,
            query,
            page,
            populate: ['reviewCount']
        }, (data) => {
            req.locals.agents = data
            next()
        })

    }

    /**
    * get 10 random agents
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
    async random(req, _, next) {
        const count = await Resource.estimatedDocumentCount().exec()
        const random = Math.floor(Math.random() * count)

        const data = await Resource.find({},)
            .skip(random)
            .limit(10)
            .populate('reviewCount')
            .sort()
            .exec()
        req.locals.agents = data
        next()
    }
}

module.exports = new AgentController()

///TODO :Set cronjob to calculate rating