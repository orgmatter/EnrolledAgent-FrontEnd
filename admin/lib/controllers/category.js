const {
    Exception,
    ErrorCodes,
    Models: { Category },
    Helper,
} = require("common")

const BaseController = require('../controllers/baseController');

class CategoryController extends BaseController {

    async create(req, res, next) {
        const { name, description } = req.body

        if (!name || !description) {
            res.status(422)
            return next(
                new Exception(
                    'Category name is required',
                    ErrorCodes.REQUIRED
                )
            )
        }
        const slug = Helper.generateSlug(name)

        const category = await Category.create({ name, description, slug })

        super.handleResult(category, res, next)

    }


    async update(req, res, next) {
        const { body: { name, description }, params: { id } } = req
        if (!BaseController.checkId('Invalid category id', req, res, next)) return

        const body = {}
        if (name) {
            body.name = name
            body.slug = Helper.generateSlug(name)
        }
        if (description) body.description = description

        let category = await Category.findByIdAndUpdate(id, body, { new: true })
        super.handleResult(category, res, next)

    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid category id', req, res, next)) return

        let category = await Category.findByIdAndDelete(id).exec()
        super.handleResult(category, res, next)
    }

    async get(req, res, next) {
        const { id } = req.params
 
        if (!BaseController.checkId('Invalid category id', req, res, next)) return
        let category = await Category.findById(id).exec()
   
        super.handleResult(category.toJSON(), res, next)

    }

    async getAll(req, res, next) {
        const cat = await Category.find({})
        .exec()
        req.locals.category = cat
        next()
    }
}

module.exports = new CategoryController()