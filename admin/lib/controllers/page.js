const {
    Helper,
    DB,
    Models: { PageView },
} = require("common");
const moment = require("moment");





const BaseController = require('./baseController');

class PageAnalyticsController extends BaseController {

    async get(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid verification id', req, res, next)) return
        let resource = await PageView.findById(id).exec()
        super.handleResult(resource, res, next)
    }
    async today(req, res, next) {
        const resource = await PageView.find(Helper.today(),)
            .sort({ count: -1 })
            .exec()
        super.handleResult(resource, res, next)
    }

    async month(req, res, next) {
        const today = Helper.today()
        const resource = await PageView.aggregate([
            { $match: { year: today.year, month: today.month } },

            {
                $group: {
                    _id: '$page', count: { $sum: "$count" },
                    month: { $avg: "$month" },
                    year: { $avg: "$year" },
                }
            },
        ])
            .sort({ count: -1 })
            .exec()
        super.handleResult(resource, res, next)
    }

    async year(req, res, next) {
        const today = Helper.today()
        const resource = await PageView.aggregate([
            { $match: { year: today.year, } },

            { $group: { _id: '$page', count: { $sum: "$count" }, year: { $avg: "$year" }, } },
        ])
            .sort({ count: -1 })
            .exec()
        super.handleResult(resource, res, next)
    }

    async getAll(req, res, next) {
        const { page, perpage, q, search, from, to } = req.query
        let query = Helper.extractQuery(req.query, ['page', 'year', 'month', 'day', 'createdAt',]) || {}
        // if (q) query = { title: { $regex: q, $options: 'i' } }

        // console.log('from', moment(from).local(), moment(to))
        // if (from) {
        //     const start = moment(from)
        //     const end = moment(to)
        //     query.createdAt = { $gt: start, $lt: end }
        //     console.log(query)
        // }

        DB.Paginate(res, next, PageView, {
            perPage: perpage,
            query,
            page,
            sort: { count: -1 },
            // populate: 
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new PageAnalyticsController()