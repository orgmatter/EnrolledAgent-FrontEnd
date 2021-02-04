const mongoose = require('mongoose')

const { Schema } = mongoose

const Partner = new Schema({
  message: String,
  email: String,
  phone: String,
  firm: String,
},  { timestamps: true })

// Partner.index({ title: 2, author: 1,  })

module.exports = mongoose.model('partner-request', Partner)
