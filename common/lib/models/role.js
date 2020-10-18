const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoleSchema = new Schema({
    name:  {
        type: String,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    },
    updatedAt: {
        type: Number,
        default: Date.now()
    },
    createdAt: {
        type: Number,
        default: Date.now()
    }
});
RoleSchema.index({ name: 1 });


const updateDate = function (next) {
    this.updatedAt = Date.now();
    next();
};
RoleSchema.pre('save', updateDate)
    .pre('update', updateDate)
    .pre('findOneAndUpdate', updateDate)
    .pre('findByIdAndUpdate', updateDate);



module.exports = mongoose.model('role', RoleSchema);
