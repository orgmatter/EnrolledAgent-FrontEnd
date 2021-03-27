const mongoose = require('mongoose')
const Validator = require('../utils/validators')

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
  firstName: { type: String, index: true },
  lastName: { type: String, index: true },
  email: String,
  bio: String,
  phone: String,
  viewCount: Number,
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
  citySlug: { type: String, slug: "city", index: true, transform: v => generateSlug(v) },
  address1: String,
  stateCode: String,
  address2: String,
  address3: String,
  country: { type: String, index: true },
  state: { type: String, index: true },
  city: { type: String, index: true },
  zipcode: { type: String, index: true },
  licence: String,
  website: String,
  fax: String,
  facebook: String,
  linkedin: String,
  twitter: String,
  instagram: String,
  googleBusiness: String,
  serviceOffered: {
    type: String,
    default: ""
  },
  taxServices: {
    type: String,
    default: ""
  },
  skills: {
    type: String,
    default: ""
  },
  membership: {
    type: String,
    default: ""
  },
  ptin: String,
  showAddress: {
    type: Boolean,
    default: true
  },
  owner: {
    type: { ref: 'user', type: Schema.ObjectId }
  },
  stateLicenced: String,
  licenceProof: String,
  title: String,
  society: [String],
  education: [String],
  lang: [String],
  industry: [String],
  maxServicePrice: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true
},
  adminPremium: { // indicates that this account was set premium by admin
    type: Boolean,
    default: false
  },
  allowContactMessage: { 
    type: Boolean,
    default: false
  },
  // accountIsPremium: { // indicates that this account was set premium by admin
  //   type: Boolean,
  //   default: false
  // },
  transaction: {
    ref: 'transaction',
    type: Schema.ObjectId,
    index: true
  },
  minServicePrice: {
    type: Number,
  },
  imageUrl: String,
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



AgentSchema.virtual('isClaimed')
  .get(function () {
    // console.log(this.owner, this._id,  typeof this.owner, Validator.isMongoId(String(this.owner))  )
    return (this.owner && Validator.isMongoId(String(this.owner)))
  })


AgentSchema.virtual('premium')
  .get(function () {
    return (this.transaction && Validator.isMongoId(String(this.transaction))) || this.adminPremium
  })

AgentSchema.virtual('reviewCount', {
  ref: 'review',
  localField: '_id',
  foreignField: 'agent',
  count: true
})

AgentSchema.virtual('review', {
  ref: 'review',
  localField: '_id',
  foreignField: 'agent',
})

AgentSchema.virtual('preference', {
  ref: 'contactPreference',
  localField: '_id',
  foreignField: 'agent',
})

module.exports = mongoose.model('agent', AgentSchema)
