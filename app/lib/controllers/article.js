const {
    Helper,
    DB,
    Models: { Article },
} = require("common")

const BaseController = require('./baseController');

class ArticleController extends BaseController {


    async get(req, res, next) {
        const { id } = req.params
        let resource = await Article.findById(id).exec()
        req.locals.article = resource
        next()

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Article, {
            perPage: perpage,
            query,
            page,
        }, (data) => {
            req.locals.articles = data
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
        const count = await Article.estimatedDocumentCount().exec()
        const random = Math.floor(Math.random() * count)

        const data = await Article.find({},)
            .skip(random)
            .limit(10)
            .sort({createdAt: -1})
            .exec()
        req.locals.articles = data
        next()
    }

}

module.exports = new ArticleController()