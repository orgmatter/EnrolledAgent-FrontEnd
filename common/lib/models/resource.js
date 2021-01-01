const mongoose = require('mongoose')

const { Schema } = mongoose

const Resource = new Schema({
  body: String,
  title: String,
  imageUrl: String,
  actionText: String,
  actionLink: String,
  sponsor: {
    ref: 'sponsor',
    type: Schema.ObjectId
  },
  category: {
    ref: 'resource_category',
    type: Schema.ObjectId
  }
},  { timestamps: true })

Resource.index({
  title: 'text',
  author: 'text', 
  'category.name': 'text',
  'category.slug': 'text',
})
 

module.exports = mongoose.model('resource', Resource)
