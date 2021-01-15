const {
    Helper,
    DB,
    Models: { LicenseVerification },
} = require("common");
const moment = require("moment");





const BaseController = require('../controllers/baseController');

class SubscriptionController extends BaseController {

    async get(req, res, next) {
        const { id } = req.params
        let resource = await LicenseVerification.findById(id).exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search, from, to } = req.query
        let query = Helper.extractQuery(req.query, ['licence', 'email', 'phone', 'city', 'state', 'zipcode',]) || {}
        // if (q) query = { title: { $regex: q, $options: 'i' } }
        console.log('from', moment(from).local(), moment(to))
        if (from) {
            const start = moment(from)
            const end = moment(to)
            query.createdAt = { gt: start, lt: end }
            console.log(query)
        }

        DB.Paginate(res, next, LicenseVerification, {
            perPage: perpage,
            query,
            page,
            sort: { createdAt: -1 },
            // populate: 
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new SubscriptionController()