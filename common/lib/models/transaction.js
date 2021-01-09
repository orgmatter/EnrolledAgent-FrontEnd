const mongoose = require('mongoose')
const Schema = mongoose.Schema
const channels = require('../utils/constants').CHANNEL
const {TRASACTION_STATUS, PATMENT_PORPOSE} = require('../utils/constants')

const TransactionSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        // purpose: {
        //     type: String,
        //     enum: [
        //         PATMENT_PORPOSE.accounUpgrade,
        //         PATMENT_PORPOSE.verification,
        //     ],
        //     default: TRASACTION_STATUS.verification 
        // },
        agent: {
            ref: 'agent',
            type: Schema.Types.ObjectId,
            index: true
        },
        licence: {
            ref: 'licenceVerification',
            type: Schema.Types.ObjectId,
            index: true
        },
        status: {
            type: String,
            // enum: [
            //     TRASACTION_STATUS.succeeded,
            //     TRASACTION_STATUS.pending,
            //     TRASACTION_STATUS.failed,
            //     TRASACTION_STATUS.abandoned
            // ],
            // default: TRASACTION_STATUS.pending
        },
        channel: {
            type: String,
            enum: ['card', 'bank', 'wallet'],
            index: true
        },
        currency: {
            type: String,
            enum: ['usd',],
            default: 'usd'
        },
        // reference: {
        //     type: String,
        //     required: true,
        //     index: true
        // },
        canceled_at: Date,
        cancellation_reason: String,
        amount_captured: Number,
        amount_refunded: Number,
        balance_transaction: String,
        billing_details: {
            address: {
                city: String,
                country: String,
                line1: String,
                line2: String,
                postal_code: String,
                state: String
            }, email: String, name: String, phone: String
        },
        calculated_statement_descriptor: String,
        captured: Boolean,
        created: Number,
        currency: String,
        // customer: null,
        description: String,
        // destination: null,
        // dispute: null,
        disputed: Boolean,
        failure_code: String,
        failure_message: String,
        fraud_details: {},
        // invoice: null,
        livemode: Boolean,
        metadata: {
            purpose: String,
            reference: String,
        },
        receipt_email: String,
        receipt_number: String,
        receipt_url: String,
        refunded: Boolean,
        // source: null,
    },
    { timestamps: true }
)


TransactionSchema.set('toObject', { virtuals: true })
TransactionSchema.set('toJSON', { virtuals: true })
 
TransactionSchema.virtual('purpose')
.get(function () {
  // console.log(this.owner, this._id,  typeof this.owner, Validator.isMongoId(String(this.owner))  )
  if(this.metadata  && this.metadata.purpose)
  return this.metadata.purpose
})

module.exports = mongoose.model('transaction', TransactionSchema)

