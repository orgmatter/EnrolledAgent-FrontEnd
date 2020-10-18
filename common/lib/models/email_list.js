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
  },
  updatedAt: {
    type: Number,
    default: Date.now()
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
})

const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}

EmailListSchema.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)

module.exports = mongoose.model('email_list', EmailListSchema)
