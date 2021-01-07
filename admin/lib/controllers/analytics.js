const {
    Exception,
    ErrorCodes,
    LogAction,
    LogCategory,
    Validator,
    Helper,
    DB,
    Models: { Agent, Log },
} = require("common")

const BaseController = require('../controllers/baseController');


class AnalyticsController extends BaseController {
   
    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { $text: { $search: search } }

        DB.Paginate(res, next, Agent, {
            perPage: perpage,
            query,
            page,
            populate: [{ path: 'reviewCount', select: ['rating'] }, { path: 'owner', select: ['_id', 'firstName'] }]
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }

}


module.exports = new AnalyticsController()
