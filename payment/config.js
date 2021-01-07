const paystack = require('paystack-api')

exports.PAYSTACK_KEY = process.env.PAYSTACK_KEY || ''

exports.Paystack = paystack(process.env.PAYSTACK_KEY)
exports.CALLBACK_URL = process.env.PORTAL_URL
exports.PUB_SUB_SECRET = process.env.PUB_SUB_SECRET
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
exports.STRIPE_SECRET = process.env.STRIPE_SECRET