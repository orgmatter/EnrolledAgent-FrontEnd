const {
    Exception,
    ErrorCodes,
    DB,
    Helper,
} = require("common");
const mongoose  = require('mongoose')

const BaseController = require('../controllers/baseController');

class CategoryController extends BaseController {
 
    /**
     * @param  {mongoose.Model} model
     */
    constructor(model) {
        super()
        this.Model = model
    }

     create = async (req, res, next)=> {
        const { name, description , priority} = req.body

        console.log(req.body)

        if (!name || !description) {
            res.status(422)
            return next(
                new Exception(
                    'Category name and description is required',
                    ErrorCodes.REQUIRED
                )
            )
        }
        const slug = Helper.generateSlug(name)

        if (await this.Model.exists({slug})) {
            res.status(422)
            return next(
                new Exception(
                    'Category already exists',
                    ErrorCodes.REQUIRED
                )
            )
        }

        const category = await this.Model.create({ name, description, slug, priority })

        super.handleResult(category, res, next)

    }


     update = async (req, res, next)=> {
        const { body: { name, description, priority }, params: { id } } = req
        if (!BaseController.checkId('Invalid category id', req, res, next)) return

        const body = {'': ''}
        if (name) {
            body.name = name
            // body.slug = Helper.generateSlug(name)
        }
        if (description) body.description = description
        if (priority && Number(priority)) body.priority = priority

        let category = await this.Model.findByIdAndUpdate(id, body, { new: true })
        super.handleResult(category, res, next)

    }


     delete = async (req, res, next) =>{
        const { id } = req.params
        if (!BaseController.checkId('Invalid category id', req, res, next)) return

        let category = await this.Model.findByIdAndDelete(id).exec()
        super.handleResult(category, res, next)
    }

     get = async (req, res, next) => {
        console.log(super.delete )
        const { id } = req.params

        if (!BaseController.checkId('Invalid category id', req, res, next)) return
        let category = await this.Model.findById(id).exec()

        super.handleResult(category, res, next)

    }

     getAll = async (req, res, next) =>{
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, this.Model, {
            perPage: perpage,
            query,
            page,
        }, (data) => {
            super.handleResultPaginated({ ...data }, res, next)
        })

    }

}

module.exports = CategoryController