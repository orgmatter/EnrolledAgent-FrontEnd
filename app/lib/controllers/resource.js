const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Resource, Category },
} = require("common")

const BaseController = require('../controllers/baseController')

Resource.ensureIndexes()
Category.ensureIndexes()

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
        if (search) query = { $text: { $search: search } }
        if (req.params.category) {
            const category = await Category.findOne({ slug: req.params.category }).exec()
            // console.log(category)
            if (category) {
                query.category = category._id
                req.locals.category = category
            } else return next()
        }
        DB.Paginate(res, next, Resource, {
            perPage: perpage,
            query,
            page,
            // populate: { path: 'category', match: { slug: 'tax' } }
        }, (data) => {
            req.locals.resource = data
            // console.log(data)
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