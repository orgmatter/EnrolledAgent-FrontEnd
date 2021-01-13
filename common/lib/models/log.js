const mongoose = require('mongoose')

const { Schema } = mongoose

const LogSchema = new Schema({
  category: String,
  ip: String,
  action: String,
  message: String,
  resource: {
    type: Schema.ObjectId
  },
  device: String,
  user: {
    // ref: 'admin_user',
    type: Schema.ObjectId
  },
}, { timestamps: true })


LogSchema.index({
  category: 'text',
  ip: 'text',
  state: 'text',
  action: 'text',
  message: 'text',
})
module.exports = mongoose.model('log', LogSchema)
