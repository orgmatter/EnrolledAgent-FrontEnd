const mongoose = require('mongoose')

const EmailListSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  unsubscribed: {
    type: Boolean,
    default: false
  }
},  { timestamps: true })
 

module.exports = mongoose.model('email_list', EmailListSchema)
