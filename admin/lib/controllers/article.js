const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Article },
} = require("common");

const BaseController = require('../controllers/baseController');

class ArticleController extends BaseController {


    async create(req, res, next) {
        const { body, preview, author, title } = req.body



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
                    'Please provide a valid action link',
                    ErrorCodes.REQUIRED
                )
            )
        }

        const b = { body, author, title, preview }



        let resource = await Article.create(b)

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
        if (!BaseController.checkId('Invalid airticle id', req, res, next)) return

        let resource = await Article.findByIdAndUpdate(id, body, { new: true })

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
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        let resource = await Article.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl) FileManager.deleteFile(resource.imageUrl)
        super.handleResult(resource, res, next)
    }


    async get(req, res, next) {
        const { id } = req.params
        let resource = await Article.findById(id).exec()
        req.locals.resource = resource
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
            req.locals.resource = data
            next()
        })

    }
}

module.exports = new ArticleController()