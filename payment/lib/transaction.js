const Paystack = require('../config').Paystack
const {
  ErrorCodes,
  Exception,
  Validator,
  Logger,
  Constants,
  Models: {
    Transaction,
    Config,
    Agent
  }
} = require('common')
const uid = require('uid')
const config = require('../config')

const Router = require('express').Router()
const Stripe = require("stripe")(config.STRIPE_SECRET_KEY);

const _Helper = require('./helper')
const log = new Logger('payment:transaction')

/**
 * initialize a transaction
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const init = async function (type, options) {

return new Promise(async (resolve, reject)=>{


  const { agent, licence, email } = options

  const _config = await Config.findOne({ slug: 'enrolled' }).exec()
  const reference = uid(20)

  let amount, purpose, description, currency
  // console.log(process.env)

  const { accountUpgradePrice, licenceVerificationPrice } = _config || { accountUpgradePrice: 10, licenceVerificationPrice: 10 }
  currency =  _config.currency || 'usd'
  switch (type) {
    case 'upgrade':
      amount = (Number(accountUpgradePrice) || 0) * 100
      purpose = Constants.PATMENT_PORPOSE.accounUpgrade
      description = 'Agent Account upgrade'
    case 'licence':
      amount = (Number(licenceVerificationPrice) || 0)* 100
      purpose = Constants.PATMENT_PORPOSE.verification
      description = 'Agent Licence Verification'
      break;
    default:
      break;
  }
  let paymentIntent
  try {
    paymentIntent = await Stripe.paymentIntents.create({
      amount,
      currency,
      description,
      receipt_email: email,
      payment_method_types: ['card'],
      metadata: {
        purpose,
        reference
      }
    });
  } catch (error) {
    console.log(error)
    reject(new Exception(
      'Could not initialize payment, please try again',
      ErrorCodes.REQUIRED
    ))
  }

  if (!paymentIntent) return reject(new Exception(
      'Could not initialize payment, please try again',
      ErrorCodes.REQUIRED
    ))

  // eslint-disable-next-line new-cap
  const transaction = Transaction({
    ...paymentIntent,
    amount,
    agent, licence
  })

  await transaction.save()
  log.info('initializing transaction', transaction)
  

  resolve({
    publishableKey: config.STRIPE_PUBLISHABLE_KEY,
    clientSecret: paymentIntent.client_secret,
    amount, currency
  })

})
}

/**
 * initialize a agent account upgrade
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const initialize = async function (req, res, next) {
  const { body, user } = req
  const { agent, email } = body

  if(!agent || !Validator.isMongoId(agent)) 
  return next(new Exception(
    'Could not find agent profile',
    ErrorCodes.REQUIRED
  ))
    const a = await Agent.findById(agent).exec()
  if(!a) 
  return next(new Exception(
    'Could not find agent profile',
    ErrorCodes.REQUIRED
  ))

  init('upgrade',  {agent, email: a.email})
    .then((result) => res.json(result))
    .catch((err) => next(err))
}

// /**
//  *  verifys a data record in the paystack account
//  * @param  {String} reference
//  * @param  {function(error, data)} done
//  */
// const verify = async function (reference, done) {
//   Paystack.transaction
//     .verify(reference)
//     .then((result) => {
//       if (result.data) _Helper.chargeSucces(result.data)
//       done(null, result)
//     })
//     .catch((err) => done(err))
// }

// /**
//  * verifys a data record in the paystack account
//  * @param  {Express.Request} req
//  * @param  {Express.Response} res
//  * @param  {function} done
//  */
// const verifyTransaction = async function (req, res, done) {
//   const {
//     body: { reference }
//   } = req
//   if (!reference) {
//     return done(
//       new Exception(
//         'transaction reference is required',
//         ErrorCodes.REQUIRED
//       )
//     )
//   }
//   Paystack.transaction
//     .verify({ reference })
//     .then((result) => {
//       // console.log(result)

//       if (result.data) _Helper.chargeSucces(result.data)
//       _Helper.handleResponse(res, done, null, result)
//     })
//     .catch((err) => {
//       // console.log(err); 
//       _Helper.handleResponse(res, done, err)
//     })
// }


Router.post('/initialize', initialize)
  // .post('/verify', verifyTransaction)
  // .post('/session', initSession)
// .post('/action/:id', action)
// .post('/charge/:id', charge)

module.exports = { Router, init }
