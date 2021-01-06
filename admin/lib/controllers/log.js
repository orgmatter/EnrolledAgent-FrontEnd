const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    Constants,
    DB,
    LogAction,
    LogCategory,
    Models: { Log },
} = require("common");




const BaseController = require('../controllers/baseController');

class LogController extends BaseController {



    // async delete(req, res, next) {
    //     const { id } = req.params
    //     if (!BaseController.checkId('Invalid article id', req, res, next)) return

    //     let resource = await Log.findByIdAndDelete(id).exec()
    //     if (resource && resource.imageUrl) FileManager.deleteFile(resource.imageUrl)
    //     super.handleResult(resource, res, next)
    //     await Log.create({
    //         user: req.user.id,
    //         action: LogAction.ARTICLE_DELETED,
    //         category: LogCategory.ARTICLE,
    //         resource: resource._id,
    //         ip: Helper.getIp(req),
    //         message: 'Log deleted'
    //     })
    // }

   
    async get(req, res, next) {
        const { id } = req.params
        let resource = await Log.findById(id)
        .populate([{path: 'user', select: {email: 1, firstName: 1, lastName: 1}}])
        .exec()
        super.handleResult(resource, res, next)
    }



    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Log, {
            perPage: perpage,
            query,
            page,
            populate: [{path: 'user', select: {email: 1, firstName: 1, lastName: 1}}]
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }
}

module.exports = new LogController()