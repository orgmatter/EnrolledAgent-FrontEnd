const { 
    Helper, 
    DB,
    Models: { Payment },
} = require("common");



const sanitizeBody = (body) => {
    delete body.user
    delete body.answer
    body[''] = ''

    return body
}


const BaseController = require('../controllers/baseController');

class PaymentController extends BaseController {

    async get(req, res, next) {
        const { id } = req.params
        let resource = await Payment.findById(id).exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, Payment, {
            perPage: perpage,
            query,
            page,
            sort: {createdAt: -1},
            // populate: 
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })
    }
}

module.exports = new PaymentController()