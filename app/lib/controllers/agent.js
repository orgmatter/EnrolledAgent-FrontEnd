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
Agent.ensureIndexes()

class AgentController extends BaseController {

    async get(req, res, next) {
        const { id } = req.params
        let agent
        if(Validator.isMongoId(id))
         agent = await Agent.findById(id).exec()

         if(!agent) return res.render('page_404')
        res.locals.agent = agent

        next()

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search }, }

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
            .populate([{ path: 'reviewCount', select: ['rating'] }, { path: 'owner', select: ['_id', 'firstName'] }])
            .sort()
            .exec()
        req.locals.agents = data
        next()
    }
}

module.exports = new AgentController()

///TODO :Set cronjob to calculate rating