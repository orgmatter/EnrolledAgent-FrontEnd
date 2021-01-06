const { nextTick } = require("async")
const {
    Exception,
    ErrorCodes,
    ErrorMessage,
    LogAction,
    LogCategory,
    FileManager,
    Storages,
    Validator,
    Helper,
    DB,
    JwtManager,
    Models: { Sponsor },
} = require("common")

class BaseController {


    static checkId(message, req, res, next) {
        const { id } = req.params
        if (!Validator.isMongoId(String(id))) {
            res.status(422)
            next(
                new Exception(
                    message,
                    ErrorCodes.REQUIRED
                )
            )
            return false
        }
        return true
    }



    static authHandler(res, req, next) {
        return next()
        if (req.isAuthenticated() &&
            req.user.accountType === 'ADMIN'
        ) return next()
        next(
            new Exception(
                ErrorMessage.NO_PRIVILEGE,
                ErrorCodes.NO_PRIVILEGE
            )
        )
    }


    /**
     *
     * @param  {object} data
     * @param  {Express.Response} res
     * @param {function} next
     */
    handleResult(data, res, next) {
        if (data) {

            res.json({ data })

        } else {
            res.status(404)
            next(
                new Exception(
                    ErrorMessage.NOT_FOUND,
                    ErrorCodes.NOT_FOUND
                )
            )
        }
    }


    /**
     *
     * @param  {object} data
     * @param  {Express.Response} res
     * @param {function} next
     */
    handleResultPaginated(data, res, next) {
        if (data) {

            res.json(data)

        } else {
            res.status(404)
            next(
                new Exception(
                    ErrorMessage.NOT_FOUND,
                    ErrorCodes.NOT_FOUND
                )
            )
        }
    }

    /**
     * Create a new record on the database
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async create(req, res, next) { }

    /**
     * get a single record from the database
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async get(req, res, next) { }

    /**
     * Get all record on the database in paginateed format
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async getAll(req, res, next) { }

    /**
     * Update a record on the database
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async update(req, res, next) { }

    /**
     * Delete a record ofrom the database
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {Function} next
     */
    async delete(req, res, next) { }
}

module.exports = BaseController