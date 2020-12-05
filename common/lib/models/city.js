const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  },
  
})

module.exports = mongoose.model('city', CitySchema)
