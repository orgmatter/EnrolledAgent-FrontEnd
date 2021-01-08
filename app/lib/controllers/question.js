const {
    Helper,
    DB,
    Validator,
    Exception,
    ErrorCodes,
    ErrorMessage,
    Models: { QuestionCategory, Question, Answer },
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
    /**
     * Ask an angent
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async create(req, res, next) {
        const { body, title, category, firstName, lastName, phone, email } = req.body

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
        const b = { body, title, category, firstName, lastName, phone, email }
        if (req.user && req.user.id) b.user = req.user.id


        let resource = await Question.create(b)
        super.handleResult({ message: 'Your question has been posted successfully' }, res, next)

    }
    /**
     * Post an answer to a question,
     * many answers can be posted to a question until the admin sets one as the answer
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async answer(req, res, next) {
        const { question, message } = req.body

        if (!(req.isAuthenticated() && req.user))
            return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

        let agent = await Agent.findOne({ owner: req.user.id }).exec()
        if (!agent || !agent._id) {
            res.status(422)
            return next(
                new Exception(
                    'Only verified agents can answer questions',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!question || !Validator.isMongoId(question) || !(await Question.exists({ _id: question }))) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid question',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!message) {
            res.status(422)
            return next(
                new Exception(
                    'message must not ne empty',
                    ErrorCodes.REQUIRED
                )
            )
        }

        await Answer.create({ agent, message, question })
        super.handleResult({ message: 'Your question has been posted successfully' }, res, next)

    }

    // async update(req, res, next) {
    //     const { params: { id } } = req
    //     if (!BaseController.checkId('Invalid resource id', req, res, next)) return

    //     const body = sanitizeBody(req.body)

    //     if (body.category && (!Validator.isMongoId(body.category) || !(await QuestionCategory.exists({ _id: body.category })))) {
    //         delete body.category
    //     }

    //     let resource = await Question.findByIdAndUpdate(id, body, { new: true }).exec()

    //     super.handleResult({ message: 'Your question has been updated successfully' }, res, next)
    // }


    async get(req, res, next) {
        const { id } = req.params
        let resource = await Question.findById(id).exec()
        req.locals.question = resource
        next()
    }

    async getAll(req, res, next) {
        const { query: { page, perpage, q, search }, params: { category } } = req
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search } }

        if (category) {
            let cat = await QuestionCategory.findOne({ slug: category })
            if (cat && cat._id) {
                query = { category: cat._id }
                req.locals.questionCategory = cat
                console.log(cat)
            } else res.redirect('/ask-ea')
        }

        DB.Paginate(res, next, Question, {
            perPage: perpage,
            query,
            page,
            populate: ['category', { path: 'answer', populate: { path: 'agent', select: { firstName: 1, lastName: 1 } } }]
        }, (data) => {
            req.locals.questions = data
            console.log(data.data)
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
        const count = await Question.estimatedDocumentCount().exec()
        const random = Math.floor(Math.random() * count)

        const data = await Question.find({})
            .skip(random)
            .limit(10)
            .sort({ createdAt: -1 })
            .exec()
        req.locals.questions = data
        console.log(data)
        next()
    }

     /**
     * get question categorirs
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async category(req, res, next) {
        const data = await QuestionCategory.find({})
            .sort({ priority: -1 })
            .exec()
        req.locals.resourceCategory = data
        console.log(data)
        next()

    }


}

module.exports = new QuestionController()