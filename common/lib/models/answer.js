const { text } = require('express')
const mongoose = require('mongoose')
const { Schema } = mongoose

const AnswerSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  question: {
    ref: 'question',
    type: Schema.ObjectId
  },
})


module.exports = mongoose.model('answer', AnswerSchema)
