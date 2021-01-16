// eslint-disable-next-line no-unused-vars
const User = require('../models/user')
const config = require('../config')
const Exception = require('./exception')
const ErrorCodes = require('./errorCodes')
const ErrorMessage = require('./errorMessage')
const Validator = require('./validators')
const Constants = require('./constants')
const Logger = require('./logger')
const log = new Logger('auth:porple')
const paswordGenerator = require('generate-password');
const moment = require('moment')
const { reject } = require('async')
/**
 * get date in day, month and year
 */
exports.today = () => {
  const tody = moment()
  //   console.log(tody)
  day = tody.date()
  month = tody.month() + 1
  year = tody.year()

  return { day, month, year }
}
/**
 * sanitize the user object to ensure we only send required data
 * back to the frontend
 * @param  {User} user
 * @param  {string} token
 * @return {object}
 */
exports.formatUser = function (user, token) {
  if (user) {
    const u = user.toJSON()
    delete u.salt
    delete u.hash
    delete u.resetToken
    return u
  }
}

exports.userToSession = function (user, accountType) {
  return {
    id: user.id,
    email: user.email,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    isSuperAdmin: user.isSuperAdmin || false,
    accountType: accountType || Constants.ACCOUNT_TYPE.user
  }
}

/**
 *user is super Admin
 * @param  {string} id
 * @return {boolean}
 */
exports.isSuperAdmin = function (id) {
  return id === config.SUPER_ADMIN
}

/**  capitalize the first  letter of every word in a string
* @param  {object} user
* @return {boolean}
*/
exports.capitalizeFirstLetter = (str) => {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

/**
* user is admin
 * @param  {object} user
 * @return {boolean}
 */
exports.isAdmin = function (user) {
  return user.accountType === 'ADMIN'
}

/**
 * check if the decoded data from the token has email and userId
 * @param  {object} user
 * @param  {function} next
 * @return {boolean}
 */
exports.checkPayload = function (user, next) {
  const { company, email } = user

  if (email && company) {
    // ensure the company is a mongo id
    return Validator.isMongoId(company)
  } else {
    next(
      new Exception(
        // eslint-disable-next-line new-cap
        ErrorMessage.EXPIRED_OR_INVALID_TOKEN,
        ErrorCodes.EXPIRED_OR_INVALID_TOKEN
      )
    )
    return false
  }
}

/**
 * parse query as object
 * @param  {string} parameters
 * @return {object}
 */
exports.parseQuery = (parameters) => {
  if (parameters == null) return null
  const a = String(parameters).split(',')
  const b = {}
  a.forEach((_) => {
    const [c, d] = String(_).split(':')
    b[c] = d
  })
  return b
}

/**
 * parse query 
 * @param  {string} parameters
 * @return {object}
 */
exports.extractQuery = (parameters, fields = []) => {
  if (parameters == null) return null
  const query = {}
  for (let index = 0; index < fields.length; index++) {
    const element = fields[index];
    if (parameters.hasOwnProperty(element)) {
      query[element] = parameters[element]
    }
    return query
  }

  const a = String(parameters).split(',')
  const b = {}
  a.forEach((_) => {
    const [c, d] = String(_).split(':')
    b[c] = d
  })
  return b
}

/**
 * @param  {[string]} scope
 * @param  {object} body
 * @param  {Express.Response} res
 * @param  {function(err, result)} done
 * @return {function(err, result)}
 */
exports.validateCompany = (scope, body, res, done) => {
  const { name, email, phone, firstname, lastname } = body
  if (scope.includes('name')) {
    if (!(name && Validator.checkLen(name, 2))) {
      log.info('invalid name', name)
      res.status(422)
      if (done) {
        done(
          new Exception(
            ErrorMessage.INVALID_NAME,
            ErrorCodes.INVALID_NAME
          )
        )
      }
      return false
    }
  }

  if (scope.includes('email')) {
    if (!(email && Validator.email(email))) {
      log.info('invalid email')
      res.status(422)
      if (done) {
        done(
          new Exception(
            'Invalid email',
            ErrorCodes.INVALID_TITLE_DESCRIPTION_P
          )
        )
      }
      return false
    }
  }

  return true
}

/**
 * geenerate password
 * @return {number}
 */
exports.generatePassword = function () {
  return paswordGenerator.generate({
    length: 7,
    // numbers: true
  })
}

/**
 * get random number of 6 characters
 * @return {number}
 */
exports.generateCode = function () {
  var randomstring = Math.abs(
    Math.floor(Math.random() * (100000 - 999999)) + 100000
  )
  return randomstring
}

/**
 * format a string removing all white spaces
 * @param {String} text
 * @return {String} 
 */
exports.generateSlug = function (text) {
  let slug = String(text)
  if (!slug) return
  slug = slug
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .replace(' ', '-')
    .toLowerCase()
    .replace(' ', '-')
    .replace(' ', '-')
  return slug
}

/**
 * get the users ip address
 * @param  {Express.Request} req
 * @return {String}
 */
exports.getIp = (req) =>
  req.headers['x-real-ip'] || req.connection.remoteAddress


/**
* returns a Promise that resolves after a delay
* @return {Number} time in milliseconds
*/
exports.delay = (time = 1000) => {
  return new Promise((resolve, reject) => {
    if (!time) reject('invalid time')
    setTimeout(resolve, time)
  })
}