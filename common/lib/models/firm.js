const mongoose = require('mongoose')

const { Schema } = mongoose

const FirmSchema = new Schema({

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
  website: String,
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

FirmSchema.set('toObject', { virtuals: true })
FirmSchema.set('toJSON', { virtuals: true })

FirmSchema.index({
  zipcode: 'text',
  city: 'text', 
  state: 'text',
  country: 'text'
})


const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
// update date for bellow 4 methods
FirmSchema.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)


  FirmSchema.virtual('reviewCount', {
    ref: 'review',
    localField: '_id',
    foreignField: 'agent',
    count: true
  })

  AgentSchema.virtual('owner', {
    ref: 'user',
    localField: '_id',
    foreignField: 'firm',
    justOne: true,
  })


module.exports = mongoose.model('agent', FirmSchema)
