const { text } = require('express')
const mongoose = require('mongoose')
const { Schema } = mongoose

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true
  },
  category: {
    ref: 'question_category',
    type: Schema.ObjectId
  },
  user: {
    ref: 'user',
    type: Schema.ObjectId
  },
  answer: {
    ref: 'answer',
    type: Schema.ObjectId
  },

})
QuestionSchema.set('toObject', { virtuals: true })
QuestionSchema.set('toJSON', { virtuals: true })

QuestionSchema.virtual('answers', {
  ref: 'answer',
  localField: '_id',
  foreignField: 'question',
})

module.exports = mongoose.model('question', QuestionSchema)
