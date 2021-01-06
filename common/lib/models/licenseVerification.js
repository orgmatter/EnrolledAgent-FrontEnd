const Constants = require('../utils/constants')
const mongoose = require('mongoose')
const { Schema } = mongoose

const LicenceVerificationSchema = new mongoose.Schema({
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  city: String,
  state: String,
  zipcode: String,
  firmName: String,
  agentFirstName: String,
  agentLastName: String,
  agentCity: String,
  agentZipcode: String,
  licence: String,
  message: String,
  preferredContact: {
      type: String,
      enum: ['phone', 'email', 'text']

  }
})


module.exports = mongoose.model('licenceVerification', LicenceVerificationSchema)
