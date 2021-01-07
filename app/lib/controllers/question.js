const {
    Helper,
    DB,
    Models: { Article, QuestionCategory, Question },
} = require("common");

const BaseController = require('./baseController');


const sanitizeBody = (body) => {
    delete body.user
    delete body.answer
    delete body.visible
    body[''] = ''
    return body
}

class QuestionController extends BaseController {

    async create(req, res, next) {
        const { body, title, category } = req.body

        if (!category || !Validator.isMongoId(category) || !(await QuestionCategory.exists({ _id: category }))) {
            res.status(422)
            return next(
                new Exception(
                    'Please select a valid category',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!title || !body) {
            res.status(422)
            return next(
                new Exception(
                    'title and body is required',
                    ErrorCodes.REQUIRED
                )
            )
        }
        const b = { body, title, category, }
        if (req.user && req.user.id) b.user = req.user.id


        let resource = await Question.create(b)
        super.handleResult({ message: 'Your question has been posted successfully' }, res, next)

    }

    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return

        const body = sanitizeBody(req.body)

        if (body.category && (!Validator.isMongoId(body.category) || !(await QuestionCategory.exists({ _id: body.category })))) {
            delete body.category
        }

        let resource = await Question.findByIdAndUpdate(id, body, { new: true }).exec()

        super.handleResult({ message: 'Your question has been updated successfully' }, res, next)
    }


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
            .sort({ createdAt: -1 })
            .exec()
        req.locals.articles = data
        next()
    }

}

module.exports = new QuestionController()