const mongoose = require('mongoose')

const { Schema } = mongoose

const Sponsor = new Schema({
  name: String,
  link: String,
  imageUrl: String,
  updatedAt: {
    type: Number,
    default: Date.now()
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
})
Sponsor.index({ name: 1 })

const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}


Sponsor.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)

module.exports = mongoose.model('sponsor', Sponsor)
