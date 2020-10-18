const mongoose = require('mongoose')

const {Schema} = mongoose

const LogSchema = new Schema({
  category: String,
  ip: String,
  action: String,
  message: String,
  device: String,
  user: {
    ref: 'user',
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

const updateDate = function(next) {
  this.updatedAt = Date.now()
  next()
}
// update date for bellow 4 methods
LogSchema.pre('save', updateDate)
    .pre('update', updateDate)
    .pre('findOneAndUpdate', updateDate)
    .pre('findByIdAndUpdate', updateDate)


module.exports = mongoose.model('log', LogSchema)
