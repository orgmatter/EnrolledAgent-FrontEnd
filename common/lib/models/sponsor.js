const mongoose = require('mongoose')

const { Schema } = mongoose

const Sponsor = new Schema({
  name: String,
  link: String,
  imageUrl: String
},  { timestamps: true })
Sponsor.index({ name: 1 })
 
module.exports = mongoose.model('sponsor', Sponsor)
