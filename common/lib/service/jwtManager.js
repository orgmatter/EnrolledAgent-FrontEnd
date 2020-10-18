const assert = require('assert')
const Cryptr = require('cryptr')
const jwt = require('jsonwebtoken')
const Exception = require('../utils/exception')
const ErrorCodes = require('../utils/errorCodes')
const ErrorMessage = require('../utils/errorMessage')
const Logger = require('../utils/logger')

const log = new Logger('common:JwtManager')

/**
 * Manages all jwt related issues
 * @param  {string} secret
 */
class JwtManager {
  /**
   * @param  {string} secret
   */
  constructor(secret) {
    assert.ok(secret, 'Secret must be defined')
    // log.info(secret)
    this.secret = secret
    this.cryptr = new Cryptr(secret)
    this.iss = 'com.wisemindssolutions'
  }

  /**
   * decode jwt error
   * @param  {object} error
   * @return {object} the structured error
   */
  decodeError(error) {
    switch (error.name) {
      case 'TokenExpiredError':
        return new Exception(
            ErrorMessage.EXPIRED_TOKEN,
            ErrorCodes.EXPIRED_TOKEN
        )
        break
      case 'JsonWebTokenError':
        return new Exception(
            ErrorMessage.UNAUTHORIZED_TOKEN,
            ErrorCodes.UNAUTHORIZED_TOKEN
        )
        break
      default:
        return new Exception(
            'could not decode your token',
            ErrorCodes.UNKNOWN
        )
    }
  }

  /**
   * generate a new JWT
   * @param  {object} data
   * @param  {string} expiresIn
   * @return {string}
   */
  signToken(data, expiresIn = '12h') {
    // encrypt the payload
    const encrypted = this.encryptData(data)
    const iss = this.iss
    const aud = 'USER'
    return jwt.sign({data: encrypted, iss, aud}, this.secret, {
      expiresIn
    })
  }
  /**
   * encrypt data
   * @param  {string} data
   * @return {object} the decoded data
   */
  encryptData(data) {
    return this.cryptr.encrypt(JSON.stringify(data))
  }

  /**
   * decode encrypted data
   * @param  {string} token
   * @return {object} the decoded token
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret, {
        iss: this.iss,
        aud: 'USER'
      })
      if (decoded.iss !== this.iss) throw jwt.JsonWebTokenError
      const data = this.decryptData(decoded.data)
      log.info(decoded.iss)
      return data
    } catch (err) {
      log.info(err)
      return this.decodeError(err)
    }
  }

  /**
   * verify that a jwt is valid
   * @param  {string} data
   * @return {object} the decoded data
   */
  decryptData(data) {
    log.info('decrypting data')
    log.info(data)
    const decrypted = this.cryptr.decrypt(data)
    log.info(decrypted)
    return JSON.parse(decrypted)
  }

  /**
   * @param  {Express.Request} req - a request object
   * @return {string} - the ezxtracted token
   */
  getTokenFromHeaders(req) {
    const {
      headers: {authorization},
      query,
      params
    } = req
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      log.info(authorization)
      return authorization.split(' ')[1]
    } else if (query && query.token) {
      return query.token
    } else if (params && params.token) {
      return params.token
    }
    return null
  }
}

module.exports = JwtManager
