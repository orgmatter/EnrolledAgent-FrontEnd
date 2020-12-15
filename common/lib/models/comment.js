const { text } = require('express')
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  
})


module.exports = mongoose.model('comment', CommentSchema)
