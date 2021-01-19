/**
 * Wisdom Ekeh ekeh.wisdom@gmail.com C2020
 */

const validator = require('validator')

exports.email = (value) => validator.isEmail(value || '')

/** returns true if the value has atleast a lowercase character,
 * an uppercase character, a number or a special character,
 * and is at least  characters long
 * @param  {string} value
 * @return {boolean}
 */
exports.password = (value) =>
  validator.matches(
      String(value),
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d@$!%~#*?&^])[A-Za-z\d@$!._\-%~*#?&^]{6,}$/
  )

/**
 * Verify if a string is a mongo id, these are usually generated by mongo
 * @param {String} value 
 */  
exports.isMongoId = (value) => validator.isMongoId(value || '')

/**
 * Verify if a string is  JSON web  token  id, these are usually generated by mongo
 * @param {String} value 
 */
exports.isToken = (value) => validator.isJWT(value)

/**
 * Check if [value] has length
 * @param {String} value 
 * @param {Number} length 
 */
exports.checkLen = (value,length) => validator.isLength(value,length)

/**
 * Verifies if value is a number
 * @param {Any} value 
 */
exports.isNumber = (value) => validator.isNumeric(value)

/**
 * Verifues that value is a url
 * @param {String} value 
 */
exports.isUrl = (value, protocols) => validator.isURL(value || '', {
  protocols:protocols|| ['https'],
  allow_underscores: true,
})
