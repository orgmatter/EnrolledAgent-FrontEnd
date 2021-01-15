const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    LogAction,
    LogCategory,
    Helper,
    DB,
    Models: { Sponsor, Log },
} = require("common")

const BaseController = require('../controllers/baseController');

class SponsorController extends BaseController {

    async create(req, res, next) {
        const { name, link } = req.body
        console.log('status',req.body, req.headers, req.file, req.files)
        if (!name || !link) {
            res.status(422)
            return next(
                new Exception(
                    'Sponsor Name and Sponsor Link are required',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let sponsor = await Sponsor.create({ name, link })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.SPONSOR,
                req.file
            )
            sponsor.imageUrl = imageUrl
            await sponsor.save()
        }
        super.handleResult(sponsor, res, next)

        await Log.create({
            user: req.user.id,
            action: LogAction.SPONSOR_CREATED,
            category: LogCategory.SPONSOR,
            resource: sponsor._id,
            ip: Helper.getIp(req),
            message: 'Sponsor Created'
        })

    }


    async update(req, res, next) {
        const { body: { name, link }, params: { id } } = req
        if (!BaseController.checkId('Invalid sponsor id', req, res, next)) return

        const body = {'': ''}
        if (name) body.name = name
        if (link) body.link = link

        let sponsor = await Sponsor.findByIdAndUpdate(id, body, { new: true }).exec()

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.SPONSOR,
                req.file
            )
            if (sponsor.imageUrl && imageUrl) FileManager.deleteFile(sponsor.imageUrl)

            sponsor.imageUrl = imageUrl
            await sponsor.save()
        }
        super.handleResult(sponsor, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.SPONSOR_UPDATED,
            category: LogCategory.SPONSOR,
            resource: sponsor._id,
            ip: Helper.getIp(req),
            message: 'Sponsor Updated'
        })


    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid sponsor id', req, res, next)) return

        let sponsor = await Sponsor.findByIdAndDelete(id).exec()
        if (sponsor  && sponsor.imageUrl) FileManager.deleteFile(sponsor.imageUrl)
        super.handleResult(sponsor, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.SPONSOR_DELETED,
            category: LogCategory.SPONSOR,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Sponsor Deleted'
        })

    }

    async get(req, res, next) {
        const { id } = req.params
 
        if (!BaseController.checkId('Invalid sponsor id', req, res, next)) return
        let sponsor = await Sponsor.findById(id).exec()
   
        super.handleResult(sponsor, res, next)

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { title: { $regex: q, $options: 'i' } }

        DB.Paginate(res, next, Sponsor, {
            perPage: perpage,
            query,
            page, 
            sort: {createdAt: -1},
        }, (data)=>{
            super.handleResultPaginated({...data}, res, next) 
        })

    }
}

module.exports = new SponsorController()