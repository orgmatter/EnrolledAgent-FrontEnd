const expressJwt = require('express-jwt')
const JwtManager = require('../service/jwtManager')
const Exception = require('../utils/exception')
const ErrorMessage = require('../utils/errorMessage')
const Logger = require('../utils/logger')
const ErrorCodes = require('../utils/errorCodes')
const config = require('../config')
const jwt = new JwtManager(config.SECRET)

const log = new Logger('common:extract_token')
/**
 * check if the token was signed by this server
 * @param  {Express.Request} req
 * @param  {object} payload
 * @param  {function} done
 * @return {null}
 */
const isRevokedCallback = function(req, payload, done) {
  // console.log(req)
  log.info(payload.iss)
  log.info(jwt.iss === payload.iss)
  if (payload.iss === jwt.iss) return done(null, false)
  return done(
      new Exception(
          ErrorMessage.UNAUTHORIZED_TOKEN,
          ErrorCodes.UNAUTHORIZED_TOKEN
      )
  )
}

exports.token = expressJwt({
  secret: jwt.secret,
  userProperty: 'user',
  getToken: jwt.getTokenFromHeaders,
  credentialsRequired: true,
  isRevoked: isRevokedCallback
})
/**
 * extract the data encoded into the token
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
exports.decodeData = function(req, res, next) {
  // console.log(req)
  log.info(req.user)
  if (req.user && req.user.data) {
    req.user = jwt.decryptData(req.user.data)
    next()
  } else {
    next(
        new Exception(
            ErrorMessage.UNAUTHORIZED,
            ErrorCodes.UNAUTHORIZED
        )
    )
  }
}
