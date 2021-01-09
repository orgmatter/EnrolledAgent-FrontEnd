const mongoose = require('mongoose');

const { Schema } = mongoose;

const ResetTokenShema = new Schema({
    expire_at: { type: Date, default: Date.now, expires: 60 * 10 },
    user: {
        type: Schema.ObjectId,
        index: true,
    },

    token: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });


ResetTokenShema.virtual('usr', {
    ref: 'user',
    localField: 'user',
    foreignField: '_id',
    justOne: true
})

ResetTokenShema.virtual('admin', {
    ref: 'admin_user',
    localField: 'user',
    foreignField: '_id',
    justOne: true
})

module.exports = mongoose.model('resetToken', ResetTokenShema);
