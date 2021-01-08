const Constants = require('../utils/constants')
const mongoose = require('mongoose')
const { Schema } = mongoose

const OffshoreSchema = new mongoose.Schema({
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
  businessSize: String,
  staffNeeded: String,
  hireUrgency: String,
  message: String,
  preferredContact: {
      type: String,
      enum: ['phone', 'email', 'text']

  }
}, { timestamps: true })


module.exports = mongoose.model('offshore', OffshoreSchema)
