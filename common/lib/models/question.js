const { text } = require('express')
const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  
})


module.exports = mongoose.model('question', QuestionSchema)
