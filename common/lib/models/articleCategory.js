const mongoose = require('mongoose')

const slug = require('mongoose-slug-updater')

options = {
  separator: "-",
  lang: "en",
  truncate: 120,
  backwardCompatible: true //support for the old options names used in the mongoose-slug-generator
}

mongoose.plugin(slug, options)

const generateSlug = function (text) {
  let slug = String(text)
  if (!slug) return
  slug = slug
  .replace(/[^a-zA-Z ]/g, "")
  .trim()
  .replace(' ', '-')
  .toLowerCase()
  .replace(' ', '-')
  .replace(' ', '-')
  return slug
}

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: { type: String, slug: "name", index: true, transform: v => generateSlug(v) },
  description: {
    type: String,
  }
  
})

CategorySchema.index({slug: 'text', name: 'text'})
CategorySchema.index({slug: 1, name: 1})

module.exports = mongoose.model('articleCategory', CategorySchema)
