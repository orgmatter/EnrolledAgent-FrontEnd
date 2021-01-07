const assert = require('assert')

assert.ok(process.env.PAYSTACK_KEY, 'Paystack key is required')
// initialize paystack
require('./config')
const Customer = require('./lib/customer')
const Transaction = require('./lib/transaction')
const events = require('./lib/events')


module.exports = {
  verifyTransaction: Transaction.verify,
  transactionRoute: Transaction.Router,
  Customer,
  Webhook: events
}
