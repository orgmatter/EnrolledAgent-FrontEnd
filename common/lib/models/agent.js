const mongoose = require('mongoose')
 
const slug = require('mongoose-slug-updater')

const { Schema } = mongoose

 
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


const AgentSchema = new Schema({

  firstName: String,
  lastName: String,
  email: String,
  bio: String,
  phone: String,
  isClaimed: {
    type: Boolean,
    default: false
  },
  rating: { // to be calculated by cronjob
    type: Number,
    min: 1,
    max: 5
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  stateSlug: { type: String, slug: "state", index: true, transform: v => generateSlug(v) },
  cityslug: { type: String, slug: "city", index: true, transform: v => generateSlug(v) },
  stateCode: String,
  education: String,
  professionalMembership: [String],
  education: String,
  phone: String,
  lisense: String,
  lisenseProof: String,
  industry: [String],
  service: [String],
  languages: [String],
  address1: String,
  address2: String,
  address3: String,
  country: String,
  state: String,
  city: String,
  zipcode: String,
  imageUrl: String,
  website: String,
}, { toJSON: { virtuals: true }, timestamps: true })

AgentSchema.set('toObject', { virtuals: true })
AgentSchema.set('toJSON', { virtuals: true })

AgentSchema.index({
  zipcode: 'text',
  city: 'text',
  state: 'text',
  country: 'text',
  firstName: 'text',
  lastName: 'text',
})

AgentSchema.virtual('reviewCount', {
  ref: 'review',
  localField: '_id',
  foreignField: 'agent',
  count: true
})
AgentSchema.virtual('owner', {
  ref: 'user',
  localField: '_id',
  foreignField: 'agent',
  justOne: true,
})


module.exports = mongoose.model('agent', AgentSchema)
