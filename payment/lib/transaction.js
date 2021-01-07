const Paystack = require('../config').Paystack
const {
  ErrorCodes,
  Exception,
  Validator,
  Logger,
  Constants,
  Models: {
    Transaction,
    Initialize,
    Charge,Subscription,

    TempSub,
    Advert,
    Package
  }
} = require('common')
const uid = require('uid')
const config = require('../config')
// config.Paystack
// eslint-disable-next-line new-cap
const Router = require('express').Router()

const _Helper = require('./helper')
const log = new Logger('payment:transaction')

const getCurrency = function (currency, data) {
  if (!Number(data.price) || !Number(data.dollar)) return null
  if (
    !currency ||
    !(
      currency == Constants.CURRENCY.naira ||
      currency == Constants.CURRENCY.dollar
    )
  )
    currency = Constants.CURRENCY.naira
  return currency
}
const getPrice = function (currency, data) {
  if (!Number(data.price) || !Number(data.dollar)) return null
  if (
    !currency ||
    !(
      currency == Constants.CURRENCY.naira ||
      currency == Constants.CURRENCY.dollar
    )
  )
    currency = Constants.CURRENCY.naira
  return (currency = Constants.CURRENCY.naira
    ? Number(data.price)
    : Number(data.dollar))
}

/**
 * create a payment session
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const initSession = async function (req, res, next) {
  const { body, user } = req

  const { plan, video } = body

  const session = uid(40)
  // console.log(body)

  if (
    !(
      Validator.isMongoId(plan || '') ||
      Validator.isMongoId(video || '')
    )
  ) {
    return next(
      new Exception(
        'This transaction is invalid',
        ErrorCodes.REQUIRED
      )
    )
  }
  let data
  if (Validator.isMongoId(plan || '')) {
    data = await Plan.findById(plan).exec()
  } else if (Validator.isMongoId(video || '')) {
    data = await Video.findById(video).exec()
  }
  if (!data.price) {
    return next(
      new Exception(
        'Could not complete transaction',
        ErrorCodes.REQUIRED
      )
    )
  }

  const currency = getCurrency(body.currency, data)
  const amount = getPrice(currency, data)
  // console.log(data, currency, amount)

  if (!amount || !Number(amount)) {
    return next(
      new Exception(
        'Could not process transaction',
        ErrorCodes.REQUIRED
      )
    )
  }



  // eslint-disable-next-line new-cap
  const transaction = TempSub({
    session,
    plan,
    video,
    amount,
    user: user.id
  })
  transaction.save()
  log.info('initializing session')
  res.json({ session, amount, currency, status: true })
}

/**
 * initialize a transaction
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const initialize = async function (req, res, next) {
  const { body, user } = req
  // console.log(user, body)

  const {  package, advert, units } = body

  const reference = uid(20)
  let amt
  if (advert) {
    const a = await Advert.findById(advert)

    if (a) amt = a.amount
  }

  if (package) {
    const a = await Package.findById(package)
    if (a) amt = a.amount
  }

  if (!amt || !Number(amt)) {
    return next(
      new Exception(
        'Invalid transaction, could not complete purchase',
        ErrorCodes.REQUIRED
      )
    )
  }


  // eslint-disable-next-line new-cap
  const transaction = Transaction({
    reference,
    amount: amt,
    // amount: amt * (Number(units) || 1),
    company: user.company,
    package,
    advert,
    units,
    user: user.id
  })
  await transaction.save()
  log.info('initializing transaction', transaction)
  Paystack.transaction
    .initialize(
      new Initialize({
        ...transaction.toJSON(),
        email: user.email,
        callback_url: `${config.CALLBACK_URL}/` + advert ? 'advert' : 'subscription'
      })
    )
    .then((result) => _Helper.handleResponse(res, next, null, result))
    .catch((err) => _Helper.handleResponse(res, next, err))
}

/**
 *  verifys a data record in the paystack account
 * @param  {String} reference
 * @param  {function(error, data)} done
 */
const verify = async function (reference, done) {
  Paystack.transaction
    .verify(reference)
    .then((result) => {
      if (result.data) _Helper.chargeSucces(result.data)
      done(null, result)
    })
    .catch((err) => done(err))
}

/**
 * verifys a data record in the paystack account
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} done
 */
const verifyTransaction = async function (req, res, done) {
  const {
    body: { reference }
  } = req
  if (!reference) {
    return done(
      new Exception(
        'transaction reference is required',
        ErrorCodes.REQUIRED
      )
    )
  }
  Paystack.transaction
    .verify({ reference })
    .then((result) => {
      // console.log(result)
     
      if (result.data) _Helper.chargeSucces(result.data)
      _Helper.handleResponse(res, done, null, result)
    })
    .catch((err) =>{
      // console.log(err); 
      _Helper.handleResponse(res, done, err)})
}

/**
 * charge bank, qr, ussd or mobile money
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} done
 */
const charge = async function (req, res, done) {
  const { body, params, user } = req

  log.info(body)
  body.email = user.email
  let charge = new Charge(body)
  log.info(charge)

  // confirm that reference was added
  if (!('amount' in charge) || !('session' in body)) {
    return next(
      new Exception(
        'transaction reference, amount and session id is required',
        ErrorCodes.REQUIRED
      )
    )
  }

  const reference = uid(20)

  // save a reference to the transaction

  // eslint-disable-next-line new-cap
  const transaction = Transaction({
    reference,
    session: body.session,
    amount: charge.amount,
    user: user.id
  })
  transaction.save()

  log.info(charge)

  // add extra data to charge
  charge = addExtraData(params.id, charge, body)

  charge.reference = reference
  log.info(charge)

  // add extra data to charge
  Paystack.charge
    .charge(charge)
    .then((result) => _Helper.handleResponse(res, done, null, result))
    .catch((err) => _Helper.handleResponse(res, done, err))

  // _Helper.handleResponse( res, done, null, {
  //   'status': true,
  //   'message': 'Charge attempted',
  //   'data': {
  //     'reference': '48rx32f1womvcr4',
  //     'status': 'pay_offline',
  //     'qr_code': '0002010216421527000104176552045499530356654031005802NG5920Babafemi enterprises6005Lagos62230519PSTK_104176000926|16304713a',
  //     'url': 'https://files.paystack.co/qr/visa/104176/Babafemi_enterprises_visaqr_1544025482956.png'
  // }
  // })
}

const addExtraData = function (key, charge, data) {
  switch (key) {
    case 'qr':
      charge.qr = {
        provider: 'visa'
      }
      break
    case 'ussd':
      charge.ussd = { type: data.type }
      break
    case 'bank':
      charge.bank = {
        code: data.code,
        account_number: data.accountNumber
      }
      break
    case 'authorization_code':
      charge.authorization_code = data.authorizationCode
      charge.pin = data.pin
      break
    default:
      break
  }
  return charge
}

/**
 * take action
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} done
 */
const action = async function (req, res, done) {
  const {
    body,
    params: { id }
  } = req
  if (!body.reference) {
    return done(
      new Exception(
        'transaction reference is required',
        ErrorCodes.REQUIRED
      )
    )
  }
  perforAction(id, body, res, done)
}

const perforAction = function (key, data, res, done) {
  switch (key) {
    case 'submit_pin':
      Paystack.charge
        .submitPIN(data)
        .then((result) =>
          _Helper.handleResponse(res, done, null, result)
        )
        .catch((err) => _Helper.handleResponse(res, done, err))
      break
    case 'submit_otp':
      Paystack.charge
        .submitOTP(data)
        .then((result) =>
          _Helper.handleResponse(res, done, null, result)
        )
        .catch((err) => _Helper.handleResponse(res, done, err))
      break
    case 'submit_phone':
      Paystack.charge
        .submitPhone(data)
        .then((result) =>
          _Helper.handleResponse(res, done, null, result)
        )
        .catch((err) => _Helper.handleResponse(res, done, err))
      break
    case 'submit_birthday':
      Paystack.charge
        .submitBirthday(data)
        .then((result) =>
          _Helper.handleResponse(res, done, null, result)
        )
        .catch((err) => _Helper.handleResponse(res, done, err))
      break
    // case 'submit_address':
    //   Paystack.charge
    //   .submitBirthday(charge)
    //   .then((result) =>_Helper.handleResponse( res, done, null, result))
    //   .catch((err) => _Helper.handleResponse( res, done, err))
    //   break
    default:
      break
  }
  return charge
}

Router.post('/initialize', initialize)
  .post('/verify', verifyTransaction)
  .post('/session', initSession)
  .post('/action/:id', action)
  .post('/charge/:id', charge)

module.exports = { Router, verify }
