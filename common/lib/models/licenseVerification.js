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
  agentPhone: String,
  agentstate: String,
  transaction: {
    ref: 'transaction',
    type: Schema.ObjectId
  },
  agentFirstName: String,
  agentLastName: String,
  agentCity: String,
  agentZipcode: String,
  licence: String,
  message: String,
  agentEmail: String,
  preferredContact: {
    type: String,
    enum: ['phone', 'email', 'text']

  }
}, { timestamps: true })


module.exports = mongoose.model('licenceVerification', LicenceVerificationSchema)
