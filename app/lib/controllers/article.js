const {
    Helper,
    DB,
    Exception,
    ErrorMessage,
    ErrorCodes,
    Constants,
    AwsService,
    LogAction,
    Validator,
    RedisService,
    Logger,
    LogCategory,
    Models: { Article, Agent, Log, ArticleCategory, Comment },
} = require("common");

const { Types } = require("mongoose");
const log = new Logger("App:article");

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

        let agent = await Agent.findOne({ owner: Types.ObjectId(req.user.id) }).exec()
        if (!agent || !agent._id) {
            AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
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
            AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
            return next(
                new Exception(
                    'Please provide a valid category',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!title || !body) {
            res.status(422)
            AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
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
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        if (!(req.isAuthenticated() && req.user))
            return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

        let agent = await Agent.findOne({ owner: Types.ObjectId(req.user.id) }).exec()
        if (!agent || !agent._id) {
            res.status(422)
            AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
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
            const imageUrl = req.file.location
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

    async comment(req, res, next) {
        const { params: { id }, body: { phone, email, name, city, state, message } } = req
        if (!BaseController.checkId('Invalid article id', req, res, next)) return

        if (!(await Article.exists({ _id: id }))) {
            res.status(422)
            return next(
                new Exception(
                    'Invalid article reference',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!message) {
            res.status(422)
            return next(
                new Exception(
                    'Message must not be empty',
                    ErrorCodes.REQUIRED
                )
            )
        }

        await Comment.create({ article: id, phone, email, name, city, state, message })

        super.handleResult({ message: 'your comment was created successfully' }, res, next)

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
        if (resource && resource.imageUrl) AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(resource.imageUrl))

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
        req.locals.agentArticles = { data: [] }
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search, $caseSensitive: false } };
        let agent
        if (req.isAuthenticated() && req.user) {
            agent = await Agent.findOne({ owner: Types.ObjectId(req.user.id) }).exec()
        }


        if (!agent || !agent._id) return next()
        DB.Paginate(res, next, Article, {
            perPage: perpage,
            query: { agent: Types.ObjectId(agent._id) },
            page,
            sort: { createdAt: -1 },
            populate: ['category', 'comment', { path: 'agent', select: { firstName: 1, lastName: 1 } }]
        }, (data) => {
            req.locals.agentArticles = data
            next()
        })
    }



    async get(req, res, next) {
        const { id } = req.params
        let resource;
        if (id && Validator.isMongoId(String(id))) resource = await Article.findById(id)
            .populate(['category', 'comment', { path: 'agent', select: { firstName: 1, lastName: 1 } }])
            .exec()
        else next()
        
        if (!resource) {
            req.session.error = 'Article not found'
            return res.redirect('/blog')
        }
        req.locals.article = resource
        next()

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search, $caseSensitive: false } };

        query.status = 'approved'

        DB.Paginate(res, next, Article, {
            perPage: perpage,
            query,
            sort: { createdAt: -1 },
            page,
            populate: ['category', 'comment', { path: 'agent', select: { firstName: 1, lastName: 1 } }]
        }, (data) => {
            req.locals.articles = data
            next()
        })

    }

    async latest(req, res, next) {
        const data = await Article.find({ status: 'approved' },)
            .limit(3)
            .sort({ createdAt: -1 })
            .populate(['category'])
            .exec()
        req.locals.latestArticle = data
        next()
    }

    async featured(req, res, next) {
        const data = await Article.find({ status: 'approved', featured: true },)
            .limit(3)
            .sort({ createdAt: -1 })
            .populate(['category', { path: 'agent', select: { firstName: 1, lastName: 1 } }])
            .exec()
        if (data && data.length > 0)
            req.locals.featuredArticle = data[0];
        next()
    }

    /**
     * get Article categorirs
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async category(req, res, next) {
        let data;
        data = await RedisService.get(Constants.CACHE_KEYS.ARTICLE_CATEGORY)
        if (data)
            data = JSON.parse(data)
        if (!data) {
            data = await ArticleCategory.find({})
                .sort({ priority: -1 })
                .lean()
                .exec()
        }
        req.locals.articleCategory = data
        // console.log(data)
        next()

    }


    /**
    * get 10 random resources
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
    async random(req, _, next) {
        DB.Random(res, next, Article,
            {
                query: { status: 'approved' },
                sort: { createdAt: -1 },
                populate: ['category', 'comment', { path: 'agent', select: { firstName: 1, lastName: 1 } }]
            }, (data) => {
                // console.log(doc);
                req.locals.articles = data
                next();
            }
        );
    }

}

module.exports = new ArticleController()

//TODO: make sure only approved and visible articles show up
