const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    LogAction,
    LogCategory,
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
        const { body, actionLink, sponsor, actionText, title, category } = req.body

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

        const b = { body, actionLink, sponsor, actionText, title, category }
        if(req.body.imageUrl && Validator.isUrl(req.body.imageUrl))
        b.imageUrl = req.body.imageUrl

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

        await Log.create({
            user: req.user.id,
            action: LogAction.RESOURCE_CREATED,
            category: LogCategory.RESOURCE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Resource Created'
        })

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

        await Log.create({
            user: req.user.id,
            action: LogAction.RESOURCE_UPDATED,
            category: LogCategory.RESOURCE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Resource Updated'
        })

    }

    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return
        let resource = await Resource.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl && !Validator.isUrl(resource.imageUrl)) FileManager.deleteFile(resource.imageUrl)
        super.handleResult(resource, res, next)

        await Log.create({
            user: req.user.id,
            action: LogAction.RESOURCE_DELETED,
            category: LogCategory.RESOURCE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Resource Deleted'
        })
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
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, Resource, {
            perPage: perpage,
            query,
            page,
            sort: {createdAt: -1},
            populate: ['sponsor', 'category']
        }, (data) => {
            super.handleResultPaginated({ ...data }, res, next)
        })
    }
}

module.exports = new ResourceController()