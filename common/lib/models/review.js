const mongoose = require('mongoose')

const { Schema } = mongoose

const Reveiw = new Schema({
  rating: {
    type: Number,
    min: 1
  },
  message: String,
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  firm: {
    ref: 'firm',
    type: Schema.ObjectId
  },
  agent: {
    ref: 'agent',
    type: Schema.ObjectId
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

Reveiw.index({ name: 1 })

const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
Reveiw.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)

module.exports = mongoose.model('review', Reveiw)
