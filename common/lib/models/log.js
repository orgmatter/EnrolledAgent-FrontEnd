const mongoose = require('mongoose')

const {Schema} = mongoose

const LogSchema = new Schema({
  category: String,
  ip: String,
  action: String,
  message: String,
  device: String,
  user: {
    ref: 'admin_user',
    type: Schema.ObjectId
  }, 
}, { timestamps: true })

module.exports = mongoose.model('log', LogSchema)
