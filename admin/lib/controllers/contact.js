const { 
    Helper, 
    DB,
    Models: { Contact },
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
            // populate: 
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new ContactController()