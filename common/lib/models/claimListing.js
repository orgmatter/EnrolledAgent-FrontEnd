const { text } = require('express')
const Constants = require('../utils/constants')
const mongoose = require('mongoose')
const { Schema } = mongoose

const ClaimListingSchema = new mongoose.Schema({
  user: {
    ref: 'user',
    type: Schema.ObjectId
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
  jobRole: String,
  companySize: String,
  companyName: String,
  companyRevenue: String,
  organizationType: String,
  annualTax: String,
  agent: {
    ref: 'agent',
    type: Schema.ObjectId
  }
}, { timestamps: true })


module.exports = mongoose.model('claimListing', ClaimListingSchema)
