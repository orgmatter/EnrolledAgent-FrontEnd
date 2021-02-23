const { 
    Helper,
    DB,
    Models: { Faq },
} = require("common")

const BaseController = require('../controllers/baseController')

Faq.ensureIndexes()

class FaqController extends BaseController {


    async get(req, res, next) {
        const { id } = req.params
        let resource = await Faq.findById(id)
        .lean()
            .exec()
        req.locals.faq = resource
        next()
    }

    async getAll(req, res, next) {
        req.locals.resource = { data: [] }
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search, $caseSensitive: false } };
       
        DB.Paginate(res, next, Faq, {
            perPage: perpage,
            query,
            page,
        }, (data) => {
            req.locals.faqs = data
            // console.log(data)
            next()
        })

    }


}

module.exports = new FaqController()