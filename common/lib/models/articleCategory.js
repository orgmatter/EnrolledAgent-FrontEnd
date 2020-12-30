const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: String,
  description: {
    type: String,
  }
  
})

CategorySchema.index({slug: 'text', name: 'text'})

module.exports = mongoose.model('articleCategory', CategorySchema)
