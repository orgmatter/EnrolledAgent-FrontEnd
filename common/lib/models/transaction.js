// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const channels = require('../utils/constants').CHANNEL
// const transactionStatus = require('../utils/constants')
//     .TRASACTION_STATUS

// const TransactionSchema = new Schema(
//     {
//         "id": "pi_1I74vOFDJSPV7IlUEmDAqfVd",
//         object: String,
//         amount: Number,
//         canceled_at: Date,
//         cancellation_reason: String,
//         amount_captured: Number,
//         amount_refunded: Number,
//         balance_transaction: String,
//         billing_details: {
//             address: {
//                 city: String,
//                 country: String,
//                 line1: String,
//                 line2: String,
//                 postal_code: String,
//                 state: String
//             }, email: String, name: String, phone: String
//         },
//         calculated_statement_descriptor: String,
//         captured: true,
//         created: Number,
//         currency: String,
//         customer: null,
//         description: String,
//         destination: null,
//         dispute: null,
//         disputed: false,
//         failure_code: null,
//         failure_message: null,
//         fraud_details: {},
//         invoice: null,
//         livemode: false,
//         metadata: {},
//         on_behalf_of: null,
//         order: null,
//         outcome: {
//             network_status: 'approved_by_network',
//             reason: null,
//             risk_level: 'normal',
//             risk_score: 61,
//             seller_message: 'Payment complete.',
//             type: 'authorized'
//         },
//         paid: true,
//         payment_intent: String,
//         payment_method: String,
//         payment_method_details: {
//             card: {
//               "brand": "visa",
//               "checks": {
//                 "address_line1_check": null,
//                 "address_postal_code_check": null,
//                 "cvc_check": "pass"
//               },
//               "country": "US",
//               "exp_month": 8,
//               "exp_year": 2022,
//               "fingerprint": "vPeyDzVsGqaEIeU8",
//               "funding": "credit",
//               "installments": null,
//               "last4": "4242",
//               "network": "visa",
//               "three_d_secure": null,
//               "wallet": null
//             },
//             type: String
//           },
//         receipt_email: String,
//         receipt_number: null,
//         receipt_url: String,
//         refunded: Boolean,
//         source: null,
//         source_transfer: null,
//         statement_descriptor: null,
//         statement_descriptor_suffix: null,
//         status: 'succeeded',
//         transfer_data: null,
//         transfer_group: null
//     },
//     amount: {
//     type: Number,
//     required: true
// },
//     units: {
//     type: Number,
//     default: 1
// },
//     package: {
//     ref: 'package',
//     type: Schema.Types.ObjectId,
//     index: true
// },
//     advert: {
//     ref: 'advert',
//     type: Schema.Types.ObjectId,
//     index: true
// },
//     company: {
//     ref: 'company',
//     type: Schema.Types.ObjectId,
//     index: true
// },
//     status: {
//     type: String,
//     enum: [
//         transactionStatus.success,
//         transactionStatus.pending,
//         transactionStatus.failed,
//         transactionStatus.abandoned
//     ],
//     default: transactionStatus.pending
// },
//     channel: {
//     type: String,
//     enum: ['card', 'bank', 'wallet'],
//     index: true
// },
//     currency: {
//     type: String,
//     enum: ['USD', 'NGN'],
//     default: 'NGN'
// },
//     reference: {
//     type: String,
//     required: true,
//     index: true
// },
//     gateway: {
//     type: String
// },
//     ipAddress: {
//     type: String,
//     trim: true
// },
//     paidAt: {
//     type: Date,
//     index: true
// }
//   },
// { timestamps: true }
// )

// module.exports = mongoose.model('transaction', TransactionSchema)

