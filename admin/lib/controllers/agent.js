const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    CSVParser,
    Models: { Agent },
} = require("common")
const path = require("path")
const { createAgent } = require('../../lib/agentUtils');

const BaseController = require('../controllers/baseController');
const STORAGE = process.env.STORAGE

const sanitizeBody = (body)=> {
    delete body.rating
    delete body.isClaimed
    return body
}
class AgentController extends BaseController {
   
    async create(req, res, next) {
        const { firstName, lastName, city, state,
            zipcode, country, phone, bio,
            address1,
            address2,
            address3, } = req.body

        if (!firstName || !lastName || !state) {
            res.status(422)
            return next(
                new Exception(
                    'Agent\'s first name, last name, and state are required',
                    ErrorCodes.REQUIRED
                )
            )
        }

        let agent = await Agent.create({
            firstName, lastName, city, state,
            zipcode, country, phone, bio,
            address1,
            address2,
            address3,
        })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.AGENT_PROFILE,
                req.file
            )
            agent.imageUrl = imageUrl
            await agent.save()
        }
        super.handleResult(agent, res, next)

    }


    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid agent id', req, res, next)) return

        const body = sanitizeBody(req.body) || {'': ''}
        console.log(body)

        let agent = await Agent.findByIdAndUpdate(id, body, { new: true })

        if (req.file) {
            const imageUrl = await FileManager.saveFile(
                Storages.AGENT_PROFILE,
                req.file
            )
            if (agent.imageUrl && imageUrl) FileManager.deleteFile(agent.imageUrl)

            agent.imageUrl = imageUrl
            await agent.save()
        }
        super.handleResult(agent, res, next)
    }


    // async delete(req, res, next) {
    //     const { id } = req.params
    //     if (!BaseController.checkId('Invalid agent id', req, res, next)) return

    //     let agent = await Agent.findByIdAndDelete(id).exec()
    //     if (agent && agent.imageUrl) FileManager.deleteFile(agent.imageUrl)
    //     super.handleResult(agent, res, next)
    // }

    async get(req, res, next) {
        const { id } = req.params

        if (!BaseController.checkId('Invalid agent id', req, res, next)) return
        let agent = await Agent.findById(id).exec()

        super.handleResult(agent.toJSON(), res, next)

    }

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

    async upload(req, res, next) {
        let file
        if (req.file) {
            file = await FileManager.saveFile(
                Storages.DOCS,
                req.file
            )

        }
        if (!file) return next(
            new Exception(
                'Please upload a csv file',
                ErrorCodes.NO_PRIVILEGE
            )
        )
        // console.log(req.file, req.files)
        CSVParser.parse(path.join(STORAGE, file), async (err, data) => {
          
            if (err) {
                // console.log('parsing csv returned an error', err)
                FileManager.deleteFile(file)
                return next(
                    new Exception(
                        'An error occured processing CSV files',
                        ErrorCodes.NO_PRIVILEGE
                    )
                )
            }

            res.json({ data: {message: 'Your uploaded file is currently being processed, wait a few minutes and confirm uploaded agents were correctly created'} })

            for (let index = 0; index < data.length; index++) {
                const agent = data[index];
                console.log('creating  agent', index)
                await createAgent(agent)
                console.log('sleeping for 10 milliseconds')
                await Helper.delay(10)
            }

            FileManager.deleteFile(file)

        })
    }
}


module.exports = new AgentController()
