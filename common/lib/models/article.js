const mongoose = require('mongoose')

const { Schema } = mongoose

const Article = new Schema({
  body: String,
  preview: String,
  author: String,
  title: String,
  imageUrl: String,
  sponsor: {
    ref: 'sponsor',
    type: Schema.ObjectId
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
Article.index({ title: 2, author: 1,  })

const updateDate = function (next) {
  this.updatedAt = Date.now()
  next()
}
Article.pre('save', updateDate)
  .pre('update', updateDate)
  .pre('findOneAndUpdate', updateDate)
  .pre('findByIdAndUpdate', updateDate)

module.exports = mongoose.model('article', Article)
