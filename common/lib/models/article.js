const mongoose = require('mongoose')
const Constants = require('../utils/constants')

const { Schema } = mongoose

const Article = new Schema({
  body: String,
  preview: String,
  author: String,
  status: {
    type: String,
    default: Constants.ARTICLE_STATUS.pending,
    enum: [
      Constants.ARTICLE_STATUS.approved,
      Constants.ARTICLE_STATUS.pending,
      Constants.ARTICLE_STATUS.rejected,
    ]
  },
  category: {
    ref: 'articleCategory',
    type: Schema.ObjectId
  },
  user: {
    ref: 'user',
    type: Schema.ObjectId
  }, 
  sponsor: {
    ref: 'sponsor',
    type: Schema.ObjectId
  },
  title: {type: String, index: true},
  imageUrl: String,
}, { timestamps: true })

Article.index({ title: 'text', body: 'text', })


module.exports = mongoose.model('article', Article)
