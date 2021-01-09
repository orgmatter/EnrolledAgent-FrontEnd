const {
    Exception,
    ErrorCodes,
    Validator,
    Helper,
    LogAction,
    LogCategory,
    DB,
    Models: { Config, Log },
} = require("common");



const sanitizeBody = (body) => {
    delete body.slug
    body[''] = ''

    return body
}


const BaseController = require('../controllers/baseController');
const QUERY = {slug: 'enrolled'}
class ConfigController extends BaseController {



    async update(req, res, next) {

        const body = sanitizeBody(req.body)

        let resource = await Config.findOneAndUpdate(QUERY, body, { new: true, upsert: true })

        super.handleResult(resource, res, next)

        await Log.create({
            user: req.user.id,
            action: LogAction.CONFIG_UPDATED,
            category: LogCategory.CONFIG,
            resource: resource._id,
            ip: Helper.getIp(req),
            message: 'Config updated'
        })


    }

    async get(req, res, next) {
        let resource = await Config.findOne(QUERY).exec()
        super.handleResult(resource, res, next)
    }
}

module.exports = new ConfigController()