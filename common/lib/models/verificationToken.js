const mongoose = require('mongoose');

const { Schema } = mongoose;

const VerifyTokenShema = new Schema({
    user: {
        type: Schema.ObjectId,
        index: true,
    }, 
   
    token: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });
 

VerifyTokenShema.virtual('usr', {
    ref: 'user',
    localField: 'user',
    foreignField: '_id',
    justOne: true
  })
  VerifyTokenShema.virtual('admin', {
    ref: 'admin_user',
    localField: 'user',
    foreignField: '_id',
    justOne: true
  })

module.exports = mongoose.model('verifyToken', VerifyTokenShema);
