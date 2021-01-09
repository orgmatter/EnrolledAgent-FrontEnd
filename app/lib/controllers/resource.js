const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Resource, ResourceCategory },
} = require("common")

const BaseController = require('../controllers/baseController')

Resource.ensureIndexes()

class ResourceController extends BaseController {


    async get(req, res, next) {
        const { id } = req.params
        let resource = await Resource.findById(id)
        .populate(['sponsor', 'category'])
        .exec()
        req.locals.resource = resource
        next()

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search } }
        if (req.params.category) {
            const category = await ResourceCategory.findOne({ slug: req.params.category }).exec()
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
            populate: ['sponsor', 'category'] 
        }, (data) => {
            req.locals.resource = data
            // console.log(data)
            next()
        })

    }

     /**
     * get resource categorirs
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async category(req, res, next) {
        const data = await ResourceCategory.find({})
            .sort({ priority: -1 })
            .exec()
        req.locals.resourceCategory = data
        // console.log(data)
        next()

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
            .populate(['sponsor', 'category'])
            .exec()
        req.locals.resource = data
        next()
    }

}

module.exports = new ResourceController()