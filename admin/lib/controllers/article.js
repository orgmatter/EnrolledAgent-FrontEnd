const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    Constants,
    DB,
    AwsService,
    LogAction,
    LogCategory,
    Models: { Article, Log, Sponsor, ArticleCategory },
} = require("common");



const sanitizeBody = (body) => {
    delete body.byAdmin
    // delete body.status
    body[''] = ''
    return body
}


const BaseController = require('../controllers/baseController');

class ArticleController extends BaseController {


    async create(req, res, next) {
        const { body, preview, author, title, sponsor, status, category, featured, } = req.body

        // console.log(req.file)

        if (!category || !Validator.isMongoId(category) || !(await ArticleCategory.exists({ _id: category }))) {
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

        const b = { body, author, title, preview, category, featured, byAdmin: true, status }

        if (req.body.sponsor && Validator.isMongoId(req.body.sponsor) && (await Sponsor.exists({ _id: req.body.sponsor }))) {
            b.sponsor = req.body.sponsor
        }

        if (req.body.imageUrl && Validator.isUrl(req.body.imageUrl))
            b.imageUrl = req.body.imageUrl



        let resource = await Article.create(b)

        if (req.file) {
            const imageUrl = req.file.location
            resource.imageUrl = imageUrl
            await resource.save()
        }
        super.handleResult(resource, res, next)

        await Log.create({
            user: req.user.id,
            action: LogAction.ARTICLE_CREATED,
            category: LogCategory.ARTICLE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Article created'
        })

    }


    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid airticle id', req, res, next)) return

        const body = sanitizeBody(req.body)

        let resource = await Article.findByIdAndUpdate(id, body || {}, { new: true })
            .populate(['sponsor', 'category'])

        if (req.file) {
            const imageUrl =  req.file.location 
            if (resource.imageUrl && imageUrl) AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(resource.imageUrl))

            resource.imageUrl = imageUrl
            await resource.save()
        }
        super.handleResult(resource, res, next)

        await Log.create({
            user: req.user.id,
            action: LogAction.ARTICLE_UPDATED,
            category: LogCategory.ARTICLE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Article Updated'
        })

    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        let resource = await Article.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl)await  AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(resource.imageUrl))
        super.handleResult(resource, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.ARTICLE_DELETED,
            category: LogCategory.ARTICLE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Article deleted'
        })
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

        let resource = await Article.findByIdAndUpdate(id, { status }, { new: true })
            .populate(['sponsor', 'category'])
            .exec()
        super.handleResult(resource, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.ARTICLE_STATUS_CHANGED,
            category: LogCategory.ARTICLE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Article Status changed'
        })
    }


    async get(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid article id', req, res, next)) return
        let resource = await Article.findById(id)
            .populate(['sponsor', 'category', {path: 'agent', select: {firstName: 1, lastName: 1}}])
            .exec()
        super.handleResult(resource, res, next)
    }



    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Article, {
            perPage: perpage,
            query,
            page,
            sort: {createdAt: -1},
            populate: ['sponsor', 'category', {path: 'agent', select: {firstName: 1, lastName: 1}}]
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new ArticleController()