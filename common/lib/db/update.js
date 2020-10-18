const Exception = require('../utils/exception')
const ErrorCodes = require('../utils/errorCodes')
const ErrorMessage = require('../utils/errorMessage')
const handleResult = require('./handleResult')
const Validator = require('../utils/validators')
const Logger = require('../utils/logger')

const log = new Logger('db:find')

/**
 * find by id and update
 * @param  {String} id
 * @param  {mongoose.Schema} Collection
 * @param  {String} body
 * @param  {Express.Response} res
 * @param  {function} next
 */
exports.byId = async function(id, Collection, body, res, next) {
  if (Validator.isMongoId(String(id))) {
    Collection.findByIdAndUpdate(id, body, {new: true})
        .then((data) => {
          log.info(data)
          handleResult.find(data, res, next)
        })
        .catch((err) => {
          log.info(err)
          next(err)
        })
  } else {
    next(new Exception(ErrorMessage.NOT_FOUND, ErrorCodes.NOT_FOUND))
  }
}

/**
 * find from collection by id
 * @param  {object} query
 * @param  {mongoose.Schema} Collection
 * @param  {Express.Response} res
 * @param  {function} next
 * @param  {String} message
 */
exports.one = async function(query, Collection, res, next, message) {
  Collection.findOne(query)
      .then((data) => {
        log.info(data)
        handleResult.find(data, res, next, message)
      })
      .catch((err) => {
        log.info(err)
        next(err)
      })
}
