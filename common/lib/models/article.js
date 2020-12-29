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
},  { timestamps: true })
Article.index({ title: 2, author: 1,  })
 

module.exports = mongoose.model('article', Article)
