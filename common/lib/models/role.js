const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoleSchema = new Schema({
    name: {
        type: String,
        lowercase: true
    },
    permissions:
        [
            { type: String }
        ],
    status: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    }, 
}, {timestamps: true});
RoleSchema.index({ name: 1 });
 


module.exports = mongoose.model('role', RoleSchema);
