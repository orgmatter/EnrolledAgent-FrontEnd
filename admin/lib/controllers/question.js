const {
    Exception,
    ErrorCodes,
    Validator,
    Helper,
    LogAction,
    LogCategory,
    DB,
    Models: { Question, Answer, QuestionCategory, Log },
} = require("common");



const sanitizeBody = (body) => {
    delete body.user
    delete body.answer
    body[''] = ''

    return body
}


const BaseController = require('../controllers/baseController');

class QuestionController extends BaseController {

    /**
     * Set an answer as the answer to a question
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async setAnswer(req, res, next) {
        const { body: { title, user, answer }, params: { id } } = req

        if (!id || !Validator.isMongoId(id) || !(await Question.exists({ _id: id }))) {
            res.status(422)
            return next(
                new Exception(
                    'Question not found on the server',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!answer || !Validator.isMongoId(answer) || !(await Answer.exists({ _id: answer, question: id }))) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid answer for this question',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let resource = await Question.findByIdAndUpdate(id, { answer }, { new: true })

        super.handleResult(resource, res, next)

    }


    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid airticle id', req, res, next)) return

        const body = sanitizeBody(req.body)

        if (body.category && !(await QuestionCategory.exists({ _id: body.category }))) {
            delete body.category
        }

        let resource = await Question.findByIdAndUpdate(id, body, { new: true })

        super.handleResult(resource, res, next)

        await Log.create({
            user: req.user.id,
            action: LogAction.QUESTION_ANSWER,
            category: LogCategory.QUESTION,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Resource Answer'
        })


    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        let resource = await Question.findByIdAndDelete(id).then(
            (doc) => {
                Answer.deleteMany({ question: doc.id }).exec()
            })
        super.handleResult(resource, res, next)


        await Log.create({
            user: req.user.id,
            action: LogAction.QUESTION_DELETED,
            category: LogCategory.QUESTION,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Resource Deleted'
        })

    }



    async get(req, res, next) {
        const { id } = req.params
        let resource = await Question.findById(id).exec()
        super.handleResult(resource, res, next)
    }



    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Question, {
            perPage: perpage,
            query,
            page,
            populate: ['user', 'answer', 'answers']
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new QuestionController()