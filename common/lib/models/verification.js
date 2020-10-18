const mongoose = require('mongoose')

const { Schema } = mongoose

const SubScriptionSchema = new Schema({
  companyName: String,
  companyAddress: String,
  companyRegNumber: String,
  companyRegDate: Date,
  directorFirstName: String,
  directorLastName: String,
  directorAddress: String,
  comment: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'declined'],
    default: 'pending'
  },
  company: {
    ref: 'company',
    type: Schema.ObjectId
  },
  files: {
    certificate: String,
    directorId: String,
    companyAddressProof: String,
    directorAddressProof: String
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
SubScriptionSchema.index({ name: 1 })

const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
SubScriptionSchema.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)

module.exports = mongoose.model('verification', SubScriptionSchema)
