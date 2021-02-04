const { 
    Helper, 
    DB,
    Models: { Contact, PartnerRequest },
} = require("common");



const sanitizeBody = (body) => {
    delete body.user
    delete body.answer
    body[''] = ''

    return body
}


const BaseController = require('../controllers/baseController');

class ContactController extends BaseController {

    async get(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid  id', req, res, next)) return
        let resource = await Contact.findById(id).exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, Contact, {
            perPage: perpage,
            query,
            page,
            sort: {createdAt: -1},
            // populate: 
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }

    async partnerReq(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        // if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, PartnerRequest, {
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

module.exports = new ContactController()