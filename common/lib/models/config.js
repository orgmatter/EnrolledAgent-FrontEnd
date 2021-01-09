const mongoose = require('mongoose')

const ConfigSchema = new mongoose.Schema({
    accountUpgradePrice: {
        type: Number
    },
    licenceVerificationPrice: {
        type: Number,
    },
    currency: {
        type: String,
        default: 'usd'
    },
    slug: {
        type: String,
        default: 'enrolled'
    }

}, { timestamps: true })


module.exports = mongoose.model('config', ConfigSchema)
