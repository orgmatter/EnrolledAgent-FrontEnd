const mongoose = require('mongoose')
const crypto = require('crypto')
const Constants = require('../utils/constants')
const uid = require('uid')
//
const { Schema } = mongoose

const UserSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
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
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    // agent: {
    //     type: { ref: 'agent', type: Schema.ObjectId }
    // },
    // firm: {
    //     type: { ref: 'firm', type: Schema.ObjectId }
    // },
    country: String,
    state: String,
    city: String,
    ip: String,
    imageUrl: String,
    passwordChangedAt: Date,
    lastLogin: Date,
    providers: [{
        type: String,
        enum: [
            Constants.PROVIDERS.FACEBOOK,
            Constants.PROVIDERS.GOOGLE,
            Constants.PROVIDERS.LINKEDIN,
        ]
    }]
}, { timestamps: true })


UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
        .toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
    if (!this.hash || !this.salt) return false
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
        .toString('hex')
    return this.hash === hash
}

/**
 * @param  {User} user
 * @param  {string} token
 * @return {object}
 */
UserSchema.methods.tokenPayload = function (user) {
    return {
        email: this.email,
        id: this.id,
        accountType: this.accountType,
    }
}

// UserSchema.methods.generateJWT = function (duration) {
//   const today = new Date();
//   const expirationDate = new Date(today);
//   expirationDate.setDate(today.getDate() + duration || 60);
//   return jwt.sign({
//     email: this.email,
//     id: this._id,
//     name: this.name,
//     accountType: this.accountType,
//     exp: parseInt(expirationDate.getTime() / 1000, 10),
//   }, process.env.SECRET);
// };

// UserSchema.methods.toAuthJSON = function(duration) {
//   return this.generateJWT(duration);
// };

module.exports = mongoose.model('user', UserSchema)