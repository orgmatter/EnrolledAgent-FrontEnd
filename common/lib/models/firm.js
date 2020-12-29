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
}, { toJSON: { virtuals: true }, timestamps: true })

FirmSchema.set('toObject', { virtuals: true })
FirmSchema.set('toJSON', { virtuals: true })

FirmSchema.index({
  zipcode: 'text',
  city: 'text', 
  state: 'text',
  country: 'text'
})

 


  FirmSchema.virtual('reviewCount', {
    ref: 'review',
    localField: '_id',
    foreignField: 'agent',
    count: true
  })

  FirmSchema.virtual('owner', {
    ref: 'user',
    localField: '_id',
    foreignField: 'firm',
    justOne: true,
  })


module.exports = mongoose.model('firm', FirmSchema)
