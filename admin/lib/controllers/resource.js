const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Resource, Sponsor, Category },
} = require("common");

const BaseController = require('../controllers/baseController');

class ResourceController extends BaseController {


    async create(req, res, next) {
        const { body, actionLink, sponsor, actionText, author, title, imageUrl, category } = req.body

        if (!Validator.isMongoId(sponsor) || !(await Sponsor.exists({ _id: sponsor }))) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid sponsor',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!Validator.isMongoId(category) || !(await Category.exists({ _id: category }))) {
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


        if (!Validator.isUrl(actionLink,   ['https'])) {
            res.status(422)
            return next(
                new Exception(
                    'Please provide a valid action link',
                    ErrorCodes.REQUIRED
                )
            )
        }

        const b = { body, actionLink, sponsor, actionText, author, title, category }

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
        const { body, params: { id } } = req
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return

        let resource = await Resource.findByIdAndUpdate(id, body, { new: true })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.RESOURCE,
                req.file
            )
            if (resource.imageUrl && imageUrl) FileManager.deleteFile(resource.imageUrl)

            resource.imageUrl = imageUrl
            await resource.save()
        }
        super.handleResult(sponsor, res, next)

    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid resource id', req, res, next)) return

        let resource = await Resource.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl) FileManager.deleteFile(resource.imageUrl)
        super.handleResult(resource, res, next)
    }


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
}

module.exports = new ResourceController()