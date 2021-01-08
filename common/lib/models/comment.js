const { text } = require('express')
const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  article: {
    ref: 'article',
    type: Schema.ObjectId
  },
  name: String,
  // lastName: String,
  state: String,
  city: String,
  email: String,
  phone: String,
  
}, { timestamps: true })


module.exports = mongoose.model('comment', CommentSchema)
