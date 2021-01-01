const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')


mongoose.plugin(slug)

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
    abbreviation: String,
    slug: { type: String, slug: "name", index: true, transform: v => generateSlug(v) },
    count: {
        type: Number,
        default: 0
    },

})
CitySchema.index({
    name: 'text',
    slug: 'text', abbreviation: 'text',
})
CitySchema.index({
    name: 1,
    slug: 1, abbreviation: 1,
})
module.exports = mongoose.model('state', CitySchema)
