const mongoose = require('mongoose')
const Validator = require('../utils/validators')
const Constants = require('../utils/constants')

const { Schema, Types } = mongoose


const ListingRequestShema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: String,
    bio: String,
    phone: String,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    status: {
        type: String,
        default: Constants.ARTICLE_STATUS.pending,
        enum: [
          Constants.ARTICLE_STATUS.approved,
          Constants.ARTICLE_STATUS.pending,
          Constants.ARTICLE_STATUS.rejected,
        ]
      },
    address1: String,
    address2: String,
    address3: String,
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zipcode: { type: String },
    licence: String,
    licenceProof: String,
    website: String,
    fax: String,
    facebook: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    society: [String],
    education: [String],
    lang: [String],
    industry: [String],
    googleBusiness: String,
    ptin: String,
    stateLicenced: String,
    title: String,
    user: {
        ref: 'user', type: Schema.ObjectId
    },
    agent: {
        ref: 'agent', type: Schema.ObjectId
    },
    maxServicePrice: {
        type: Number,
    },
    minServicePrice: {
        type: Number,
    },
    imageUrl: String,
}, { toJSON: { virtuals: true }, timestamps: true })


module.exports = mongoose.model('listingRequest', ListingRequestShema)
