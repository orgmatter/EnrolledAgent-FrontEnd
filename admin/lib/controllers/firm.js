const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    Models: { Firm },
} = require("common")

const BaseController = require('../controllers/baseController');

class AgentController extends BaseController {

    async create(req, res, next) {
        const { firstName, lastName, city, state,
            zipcode, country, phone,
            address1,
            bio,
            address2,
            address3, } = req.body

        if (!firstName || !lastName || !state) {
            res.status(422)
            return next(
                new Exception(
                    'Firm\'s first name, last name, and state are required',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let sponsor = await Firm.create({ name, link })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.SPONSOR,
                req.file
            )
            sponsor.imageUrl = imageUrl
            await sponsor.save()
        }
        super.handleResult(sponsor, res, next)

    }


    async update(req, res, next) {
        const { body: { name, link }, params: { id } } = req
        if (!BaseController.checkId('Invalid sponsor id', req, res, next)) return

        const body = {}
        if (name) body.name = name
        if (link) body.link = link

        let sponsor = await Firm.findByIdAndUpdate(id, body, { new: true })

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

    }


    async delete(req, res, next) {
        const { id } = req.params
        if (!BaseController.checkId('Invalid sponsor id', req, res, next)) return

        let sponsor = await Firm.findByIdAndDelete(id).exec()
        if (sponsor && sponsor.imageUrl) FileManager.deleteFile(sponsor.imageUrl)
        super.handleResult(sponsor, res, next)
    }

    async get(req, res, next) {
        const { id } = req.params

        if (!BaseController.checkId('Invalid sponsor id', req, res, next)) return
        let sponsor = await Firm.findById(id).exec()

        super.handleResult(sponsor.toJSON(), res, next)

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Firm, {
            perPage: perpage,
            query,
            page,
            populate: ['reviewCount'],
        }, (data) => {
            super.handleResultPaginated({ ...data }, res, next)
        })

    }
}

module.exports = new AgentController()