const mongoose = require('mongoose')
 
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
  website: String,
}, { toJSON: { virtuals: true }, timestamps: true })

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
