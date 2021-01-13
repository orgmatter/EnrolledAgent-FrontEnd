const mongoose = require('mongoose');

const { Schema } = mongoose;

const FaqSchema = new Schema({
    title: {
        type: String
    },
    message: {
        type: String
    },
}, { timestamps: true });


FaqSchema.index({
    title: 'text',
    message: 'text'
  })



module.exports = mongoose.model('faq', FaqSchema);
