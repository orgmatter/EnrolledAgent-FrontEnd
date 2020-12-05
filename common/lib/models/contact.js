const mongoose = require('mongoose')

const { Schema } = mongoose

const Contact = new Schema({
  message: String,
  email: String,
  phone: String,
  subject: String,
  name: String,
  updatedAt: {
    type: Number,
    default: Date.now()
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
})
Contact.index({ title: 2, author: 1,  })

const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
Contact.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)

module.exports = mongoose.model('contact', Contact)
