const mongoose = require('mongoose')
const crypto = require('crypto')
const Constants = require('../utils/constants')
const uid = require('uid')
//
const { Schema } = mongoose

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  accountType: {
    type: String,
    default: Constants.ACCOUNT_TYPE.admin
  },
  jobTitle: String,
  role: {
    ref: 'role',
    type: Schema.Types.ObjectId
  },
  firstName: String,
  lastName: String,
  phone: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  address: String,
  country: String,
  state: String,
  city: String,
  zipcode: String,
  imageUrl: String,

}, { timestamps: true })

UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

UserSchema.virtual('permissions')
  .get(function () {
    if (this.role && this.role.permissions) return this.role.permissions
    return []
  })

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

module.exports = mongoose.model('admin_user', UserSchema)
