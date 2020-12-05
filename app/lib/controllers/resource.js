const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Resource },
} = require("common")

const BaseController = require('../controllers/baseController');

class ResourceController extends BaseController {


    async get(req, res, next) {
        const { id } = req.params
        let resource = await Resource.findById(id).exec()
        req.locals.resource = resource
        next()

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Resource, {
            perPage: perpage,
            query,
            page,
        }, (data) => {
            req.locals.resource = data
            next()
        })

    }


    /**
    * get 10 random resources
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
            .populate('sponsor')
            .exec()
        req.locals.resource = data
        next()
    }

}

module.exports = new ResourceController()