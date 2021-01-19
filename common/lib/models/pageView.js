const mongoose = require('mongoose')

const { Schema } = mongoose

const PageView = new Schema({
    count: {
        type: Number,
        min: 0
    },
    month: { type: Number, index: true },
    year: { type: Number, index: true },
    day: { type: Number, index: true },
    page: {type: String, index: true},
}, { timestamps: true })


module.exports = mongoose.model('pageview', PageView)
