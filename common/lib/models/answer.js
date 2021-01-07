const { text } = require('express')
const mongoose = require('mongoose')
const { Schema } = mongoose

const AnswerSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  agent: {
    ref: 'agent',
    type: Schema.ObjectId
  },
  byAdmin: {
    type: Boolean,
    default: false
  },
  question: {
    ref: 'question',
    type: Schema.ObjectId
  },
}, { timestamps: true })


module.exports = mongoose.model('answer', AnswerSchema)
