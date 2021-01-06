const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    Constants,
    DB,
    Models: { Question, Sponsor, QuestionCategory },
} = require("common");
const { QuestionCategory } = require("common/lib/models");



const sanitizeBody = (body)=> {
    delete body.rating
    delete body.isClaimed
    return body
}


const BaseController = require('../controllers/baseController');

class QuestionController extends BaseController {


    async create(req, res, next) {
        const { body, title, sponsor, user } = req.body

        if (!category || !Validator.isMongoId(category) || !(await QuestionCategory.exists({ _id: category }))) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid category',
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


        if (!actionLink || !actionText) {
            res.status(422)
            return next(
                new Exception(
                    'Action link and action text is required',
                    ErrorCodes.REQUIRED
                )
            )
        }

        const b = { body, title, user, category }

        let resource = await Question.create(b)

        super.handleResult(resource, res, next)

    }


    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid airticle id', req, res, next)) return

       const body = sanitizeBody(req.body)

        let resource = await Question.findByIdAndUpdate(id, body || {}, { new: true })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.RESOURCE,
                req.file
            )
            if (resource.imageUrl && imageUrl) FileManager.deleteFile(resource.imageUrl)

            resource.imageUrl = imageUrl
            await resource.save()
        }
        super.handleResult(resource, res, next)

    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        let resource = await Question.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl) FileManager.deleteFile(resource.imageUrl)
        super.handleResult(resource, res, next)
    }

    async status(req, res, next) {
        const { body: { status, id } } = req
        req.params.id = id
        // console.log('status', (status in {'pending': 1}))
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        /// verify that the status is part of our accepted status
        if (!(status in Constants.ARTICLE_STATUS)) {

            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid status',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let resource = await Question.findByIdAndUpdate(id, { status }, { new: true }).exec()
        super.handleResult(resource, res, next)
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
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new QuestionController()