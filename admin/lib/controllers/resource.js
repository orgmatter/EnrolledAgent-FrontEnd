const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Resource, Sponsor, ResourceCategory },
} = require("common");

const BaseController = require('../controllers/baseController');


const sanitizeBody = (body) => {
    delete body.user
    delete body.answer
    body[''] = ''

    return body
}

class ResourceController extends BaseController {

    async create(req, res, next) {
        const { body, actionLink, sponsor, actionText, title, imageUrl, category } = req.body

        if (!sponsor || !Validator.isMongoId(sponsor) || !(await Sponsor.exists({ _id: sponsor }))) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid sponsor',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!category || !Validator.isMongoId(category) || !(await ResourceCategory.exists({ _id: category }))) {
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


        if (!Validator.isUrl(actionLink, ['https'])) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide an action link starting with https',
                    ErrorCodes.REQUIRED
                )
            )
        }

        const b = { body, actionLink, sponsor, actionText, title, category, imageUrl }

        if (Validator.isUrl(imageUrl)) b.imageUrl = imageUrl

        let resource = await Resource.create(b)

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.RESOURCE,
                req.file
            )
            resource.imageUrl = imageUrl
            await resource.save()
        }
        super.handleResult(resource, res, next)

    }

    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return

        const body = sanitizeBody(req.body)

        if (body.sponsor, !Validator.isMongoId(body.sponsor) || !(await Sponsor.exists({ _id: body.sponsor }))) {
            delete body.sponsor
        }

        if (body.category, !Validator.isMongoId(body.category) || !(await ResourceCategory.exists({ _id: body.category }))) {
            delete body.category
        }

        let resource = await Resource.findByIdAndUpdate(id, body, { new: true })
        .populate(['sponsor', 'category'])

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.RESOURCE,
                req.file
            )
            if (resource.imageUrl && imageUrl && !Validator.isUrl(resource.imageUrl)) FileManager.deleteFile(resource.imageUrl)

            resource.imageUrl = imageUrl
            await resource.save()
        }
        super.handleResult(resource, res, next)

    }

    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return
        let resource = await Resource.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl && !Validator.isUrl(resource.imageUrl)) FileManager.deleteFile(resource.imageUrl)
        super.handleResult(resource, res, next)
    }

    async get(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return
        const resource = await Resource.findById(id)
        .populate(['sponsor', 'category'])
        .exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Resource, {
            perPage: perpage,
            query,
            page,
            populate: ['sponsor', 'category']
        }, (data) => {
            super.handleResultPaginated({ ...data }, res, next)
        })
    }
}

module.exports = new ResourceController()