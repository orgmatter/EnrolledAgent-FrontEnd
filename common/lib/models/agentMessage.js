const mongoose = require('mongoose')

const { Schema } = mongoose

const AgentMessage = new Schema({
  message: String,
  email: String,
  phone: String,
  subject: String,
  name: String,
  agent: {
    ref: 'agent',
    type: Schema.ObjectId
  }, 
},  { timestamps: true }) 

module.exports = mongoose.model('agentmessage', AgentMessage)
