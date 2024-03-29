const { 
    Helper, 
    DB,
    Models: { Offshore },
} = require("common");



const sanitizeBody = (body) => {
    delete body.user
    delete body.answer
    body[''] = ''

    return body
}


const BaseController = require('../controllers/baseController');

class SubscriptionController extends BaseController {

    async get(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid id', req, res, next)) return
        let resource = await Offshore.findById(id).exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, Offshore, {
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

module.exports = new SubscriptionController()