const {
    Helper,
    DB,
    Exception,
    ErrorMessage,
    ErrorCodes,
    FileManager,
    LogAction,
    Validator,
    Storages,
    LogCategory,
    Models: { Article, Agent, Log, ArticleCategory },
} = require("common");

const BaseController = require('./baseController');

const sanitizeBody = (body) => {
    delete body.status
    delete body.agent
    body[''] = ''
    return body
}
class ArticleController extends BaseController {


    async create(req, res, next) {
        const { body, preview, title, sponsor, category } = req.body

        if (!(req.isAuthenticated() && req.user))
            return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

        let agent = await Agent.findOne({ owner: req.user.id }).exec()
        if (!agent || !agent._id) {
            res.status(422)
            return next(
                new Exception(
                    'Only verified agents can create articles',
                    ErrorCodes.REQUIRED
                )
            )
        }

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

        const b = { body, title, preview, sponsor, category, agent: agent._id }

        if (req.body.imageUrl && Validator.isUrl(req.body.imageUrl))
            b.imageUrl = req.body.imageUrl

        let resource = await Article.create(b)

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.ARTICLE,
                req.file
            )
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

        if (!(req.isAuthenticated() && req.user))
            return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

        let agent = await Agent.findOne({ owner: req.user.id }).exec()
        if (!agent || !agent._id) {
            res.status(422)
            return next(
                new Exception(
                    'Only verified agents can update articles',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let article = await Article.findById(id).exec()
        if (article.agent != agent._id) {
            res.status(422)
            return next(
                new Exception(
                    'You can only update articles linked to your agent profile',
                    ErrorCodes.REQUIRED
                )
            )
        }

        const body = sanitizeBody(req.body)

        let resource = await Article.findByIdAndUpdate(id, body, { new: true })
            .populate(['sponsor', 'category'])

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.ARTICLE,
                req.file
            )
            if (resource.imageUrl && imageUrl) FileManager.deleteFile(resource.imageUrl)

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

        if (!(req.isAuthenticated() && req.user))
            return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

        let agent = await Agent.findOne({ owner: req.user.id }).exec()
        if (!agent || !agent._id) {
            res.status(422)
            return next(
                new Exception(
                    'Only verified agents can delete articles',
                    ErrorCodes.REQUIRED
                )
            )
        }
        let article = await Article.findById(id).exec()
        if (article.agent != agent._id) {
            res.status(422)
            return next(
                new Exception(
                    'You can only update delete linked to your agent profile',
                    ErrorCodes.REQUIRED
                )
            )
        }


        let resource = await Article.findByIdAndDelete(id).exec()
        if (resource && resource.imageUrl) FileManager.deleteFile(resource.imageUrl)

        super.handleResult({ message: 'Article deleted succesfully' }, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.ARTICLE_DELETED,
            category: LogCategory.ARTICLE,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Article deleted'
        })
    }

    /**
     * get articles belonging to an agent
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async agentArticles(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }
        let agent
        if (req.isAuthenticated() && req.user) {
            agent = await Agent.findOne({ owner: req.user.id }).exec()
        }


        if (agent && agent._id) {
            DB.Paginate(res, next, Article, {
                perPage: perpage,
                query: { agent: agent._id },
                page,
            }, (data) => {
                req.locals.agentArticles = data
                next()
            })
        } else next()

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

module.exports = new ArticleController()

//TODO: make sure only approved and visible articles show up