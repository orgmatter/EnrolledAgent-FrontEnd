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

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  state: String,
  stateSlug: { type: String, slug: "state", index: true, transform: v => generateSlug(v) },
  slug: { type: String, slug: "name", index: true, transform: v => generateSlug(v) },
  count: {
    type: Number,
    default: 0
  },

})

CitySchema.index({
  name: 1,
  slug: 1,  
})
module.exports = mongoose.model('city', CitySchema)
