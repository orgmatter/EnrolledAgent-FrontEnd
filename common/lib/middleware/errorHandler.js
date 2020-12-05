// const MulterError = require('multer').MulterError
const Exception = require('../utils/exception')
const ErrorMessage = require('../utils/errorMessage')
const ErrorCodes = require('../utils/errorCodes')
const Logger = require('../utils/logger')
const UnauthorizedError = require('express-jwt').UnauthorizedError
const JsonWebTokenError = require('jsonwebtoken').JsonWebTokenError
const log = new Logger('common:ErrorHandler')

/**
 * handles sending error responses,
 * you are expected to set the error code on the reponse object
 * @param  {object} err
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 * @return {null}
 */
module.exports = function (err, req, res, next) {
  log.info(JSON.stringify(err))

  if (err.code === 'EBADCSRFTOKEN') return res.status(403).json({ error: { message: 'Invalid Token', code: 8000 } })

  // handle CSRF token errors here
  // res.status(403)
  if (res.statusCode < 400) res.status(400)
  if (err instanceof Exception) return res.json({ error: err })
  if (
    err instanceof UnauthorizedError ||
    err instanceof JsonWebTokenError
  ) {
    return res.status(401).json({
      error: new Exception(
        ErrorMessage.UNAUTHORIZED,
        ErrorCodes.UNAUTHORIZED_TOKEN
      )
    })
  }
  if (err.name == 'MulterError') {
    return handleMulter(err, req, res, next)
  }
  if (err.error && err.error.message != null) {
    return res.json(err)
  }
  if (res.body != null && res.body.error != null) {
    return res.json(res.body)
  }
  res.json({
    error: new Exception(ErrorMessage.UNKNOWN, ErrorCodes.UNKNOWN)
  })
}

const handleMulter = function (err, req, res, next) {
  console.log(err.code)
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      return res.status(413).json({
        error: new Exception(
          ErrorMessage.FILE_TOO_LARGE,
          ErrorCodes.FILE_TOO_LARGE
        )
      })
      break
    case 'LIMIT_UNEXPECTED_FILE':
      return res.status(400).json({
        error: new Exception(
          'An unexpected error occured could not upload this file',
          ErrorCodes.FILE_TOO_LARGE
        )
      })
      break
    default:
      return res.status(400).json({
        error: new Exception(
          'An unexpected error occured could not upload this file',
          ErrorCodes.FILE_TOO_LARGE
        )
      })
      break
  }
  return res.status(401).json({
    error: new Exception(
      ErrorMessage.UNAUTHORIZED,
      ErrorCodes.UNAUTHORIZED_TOKEN
    )
  })
}
// type ErrorCode =
//   | 'LIMIT_PART_COUNT'
//   | 'LIMIT_FILE_SIZE'
//   | 'LIMIT_FILE_COUNT'
//   | 'LIMIT_FIELD_KEY'
//   | 'LIMIT_FIELD_VALUE'
//   | 'LIMIT_FIELD_COUNT'
//   | 'LIMIT_UNEXPECTED_FILE'
