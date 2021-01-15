const { 
    Helper, 
    DB,
    Models: { EmailList },
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
        let resource = await EmailList.findById(id).exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, EmailList, {
            perPage: perpage,
            query,
            page,
            // populate: 
            sort: {createdAt: -1},
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new SubscriptionController()