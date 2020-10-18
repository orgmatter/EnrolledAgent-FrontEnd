// eslint-disable-next-line no-unused-vars
const Express = require('express')
const Exception = require('../utils/exception')
const ErrorMessage = require('../utils/errorMessage')
const ErrorCodes = require('../utils/errorCodes')

/**
 * Handles sending message incase of a 404
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
module.exports = function(req, res, next) {
  res.status(404)
  next(new Exception(ErrorMessage.NOT_FOUND, ErrorCodes.NOT_FOUND))
}
