const Exception = require('../utils/exception')
const ErrorCodes = require('../utils/errorCodes')
const ErrorMessage = require('../utils/errorMessage')

/**
 *
 * @param  {object} data
 * @param  {Express.Response} res
 * @param {function} next
 * @param  {String} message
 */
exports.find = function(data, res, next, message) {
  if (data) res.status(200).json({data: data})
  else {
    next(
        new Exception(
            message || ErrorMessage.NOT_FOUND,
            ErrorCodes.NOT_FOUND
        )
    )
  }
}
