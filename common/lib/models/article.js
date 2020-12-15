const mongoose = require('mongoose')

const { Schema } = mongoose

const Article = new Schema({
  body: String,
  preview: String,
  author: String,
  approved: {
    type: Boolean,
    default: false
  },
  title: String,
  imageUrl: String,
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
