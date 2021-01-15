const mongoose = require('mongoose')

const { Schema } = mongoose

const Contact = new Schema({
  message: String,
  email: String,
  phone: String,
  subject: String,
  name: String
},  { timestamps: true })

// Contact.index({ title: 2, author: 1,  })

module.exports = mongoose.model('contact', Contact)
