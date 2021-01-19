const mongoose = require('mongoose')
const Constants = require('../utils/constants')

const { Schema } = mongoose

const Article = new Schema({
  body: String,
  preview: String,
  articleAuthor: String,
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
  visible: {
    type: Boolean,
    default: true
  },

  byAdmin: {
    type: Boolean,
    default: false
  },

  featured: {
    type: Boolean,
    default: false
  },
  agent: {
    ref: 'agent',
    type: Schema.ObjectId
  },
  sponsor: {
    ref: 'sponsor',
    type: Schema.ObjectId
  },
  title: { type: String, index: true },
  imageUrl: String,
}, { timestamps: true })

Article.index({ title: 'text', body: 'text', })

Article.set('toObject', { virtuals: true })
Article.set('toJSON', { virtuals: true })


Article.virtual('author')
  .get(function () {
    if (this.agent && this.agent._id) return `${this.agent.firstName || ''} ${this.agent.lastName || ''}`
    return this.articleAuthor || 'Enrolled Agents'
  })

Article.virtual('comment', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'article',
})

Article.virtual('commentCount', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'article',
  count: true
})



module.exports = mongoose.model('article', Article)
