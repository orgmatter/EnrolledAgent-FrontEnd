const mongoose = require('mongoose')
const crypto = require('crypto')
const Constants = require('../utils/constants')
const uid = require('uid')
//
const { Schema } = mongoose

const AgentSchema = new Schema({

  firstName: String,
  lastName: String,
  email: String,
  bio: String,
  phone: String, 
  isClaimed: {
    type: Boolean,
    default: false
  },
  rating: { // to be calculated by cronjob
    type: Number,
    min: 1,
    max: 5
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
}, { toJSON: { virtuals: true } })

AgentSchema.set('toObject', { virtuals: true })
AgentSchema.set('toJSON', { virtuals: true })

AgentSchema.index({
  zipcode: 'text',
  city: 'text', 
  state: 'text',
  country: 'text',
  firstName: 'text',
  lastName: 'text',
})


const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
// update date for bellow 4 methods
AgentSchema.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)


  AgentSchema.virtual('reviewCount', {
    ref: 'review',
    localField: '_id',
    foreignField: 'agent',
    count: true
  })
  AgentSchema.virtual('owner', {
    ref: 'user',
    localField: '_id',
    foreignField: 'agent',
    justOne: true,
  })


module.exports = mongoose.model('agent', AgentSchema)
