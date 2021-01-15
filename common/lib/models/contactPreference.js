const mongoose = require('mongoose')
const { Schema } = mongoose

const ContactPreferenceSchema = new mongoose.Schema({
  preferredContact: {
    type: String,
    enum: ['phone', 'email', 'text']

  },
  articlePublished: {
    type: Boolean,
    default: true
  },
  messageReceived: {
    type: Boolean,
    default: true
  },
  newReview: {
    type: Boolean,
    default: true
  },
  agent: {
    ref: 'agent',
    type: Schema.ObjectId
  },
}, { timestamps: true })


module.exports = mongoose.model('contactPreference', ContactPreferenceSchema)
