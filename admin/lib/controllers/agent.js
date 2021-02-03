const {
    Exception,
    ErrorCodes,
    FileManager,
    Storages,
    LogAction,
    LogCategory,
    Validator,
    Constants,
    AwsService,
    Helper,
    DB,
    CSVParser,
    Models: { Agent, Log },
} = require("common")
const path = require("path")
const { createAgent } = require('../../lib/agentUtils');

const BaseController = require('../controllers/baseController');
const STORAGE = process.env.STORAGE

const sanitizeBody = (body) => {
    delete body.rating
    delete body.owner
    body[''] = ''
    return body
}
class AgentController extends BaseController {

    async create(req, res, next) {
        const { firstName, lastName, email, bio, phone, gender, address1, address2, address3, state,
            city, zipcode, licence, website, fax, facebook, linkedin, twitter, instagram, googleBusiness, ptin,
            showAddress, society, education, lang, industry, maxServicePrice, minServicePrice, } = req.body

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
            firstName, lastName, email, bio, phone, gender, address1, address2, address3, state,
            city, zipcode, licence, website, fax, facebook, linkedin, twitter, instagram, googleBusiness, ptin,
            showAddress, society, education, lang, industry, maxServicePrice, minServicePrice,
        })

        if (req.file) {
            const imageUrl = req.file.location
            agent.imageUrl = imageUrl
            await agent.save()
        }
        super.handleResult(agent, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.AGENT_CREATED,
            category: LogCategory.AGENT,
            resource: agent._id,
            ip: Helper.getIp(req),
            message: 'Agent Created'
        })

    }


    async update(req, res, next) {
        const { params: { id } } = req
        if (!BaseController.checkId('Invalid agent id', req, res, next)) return

        const body = sanitizeBody(req.body)  
        // console.log(body)

        let agent = await Agent.findByIdAndUpdate(id, body, { new: true }).exec()

        if (req.file) {
            const imageUrl = req.file.location
            if (agent.imageUrl && imageUrl) AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(agent.imageUrl))

            agent.imageUrl = imageUrl
            await agent.save()
        }
        super.handleResult(agent, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.AGENT_UPDATED,
            category: LogCategory.AGENT,
            resource: agent._id,
            ip: Helper.getIp(req),
            message: 'Agent Updated'
        })
    }


    async get(req, res, next) {
        const { id } = req.params

        if (!BaseController.checkId('Invalid agent id', req, res, next)) return
        let agent = await Agent.findById(id).exec()

        super.handleResult(agent, res, next)
        await Log.create({
            user: req.user.id,
            action: LogAction.AGENT_DELETED,
            category: LogCategory.AGENT,
            resource: agent._id,
            ip: Helper.getIp(req),
            message: 'Agent Deleted'
        })

    }

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query, ['email', 'firstName', 'lastName', 'zipcode', 'city', 'state', 'licence', ]) || {}
        if (search) query = { $text: { $search: search, $caseSensitive: false } };

        DB.Paginate(res, next, Agent, {
            perPage: perpage,
            query,
            page,
            sort: {createdAt: -1},
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

            res.json({ data: { message: 'Your uploaded file is currently being processed, wait a few minutes and confirm uploaded agents were correctly created' } })

            for (let index = 0; index < data.length; index++) {
                const agent = data[index];
                console.log('creating  agent', index)
                await createAgent(agent)
                console.log('sleeping for 10 milliseconds')
                await Helper.delay(10)
            }

            FileManager.deleteFile(file)
            await Log.create({
                user: req.user.id,
                action: LogAction.AGENT_UPLOADED,
                category: LogCategory.AGENT,
                resource: agent._id,
                ip: Helper.getIp(req),
                message: 'Agents Uploaded'
            })
        })
    }
}


module.exports = new AgentController()
