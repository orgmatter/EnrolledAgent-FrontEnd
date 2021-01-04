const mongoose = require('mongoose')

const { Schema } = mongoose

const Reveiw = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5
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
  }
},  { timestamps: true })

Reveiw.index({ name: 1 })
 

module.exports = mongoose.model('review', Reveiw)
