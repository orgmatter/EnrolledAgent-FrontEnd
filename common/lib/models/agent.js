const mongoose = require('mongoose')
const crypto = require('crypto')
const Constants = require('../utils/constants')
const uid = require('uid')
//
const { Schema } = mongoose

const AgentSchema = new Schema({

  name: String,
  email: String,
  phone: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isClaimed: {
    type: Boolean,
    default: true
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  address1: String,
  address2: String,
  address3: String,
  country: String,
  state: String,
  city: String,
  zipcode: String,
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

AgentSchema.set('toObject', { virtuals: true })
AgentSchema.set('toJSON', { virtuals: true })


const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
// update date for bellow 4 methods
AgentSchema.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)



module.exports = mongoose.model('agent', AgentSchema)
