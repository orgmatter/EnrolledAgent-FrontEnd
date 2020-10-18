// eslint-disable-next-line no-unused-vars
const Express = require('express')
const Exception = require('../utils/exception')
const ErrorMessage = require('../utils/errorMessage')
const ErrorCodes = require('../utils/errorCodes')
const {API_KEY} = require('../config')

/**
 * bars requests from random sources
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
module.exports = function(req, res, next) {
  const {
    headers: {apikey}
  } = req
  if (apikey && apikey === API_KEY) next()
  else {
    res.status(401)
    next(
        new Exception(
            ErrorMessage.UNAUTHORIZED,
            ErrorCodes.UNAUTHORIZED_KEY
        )
    )
  }
}
