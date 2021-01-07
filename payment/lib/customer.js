const Paystack = require('../config').Paystack
const {
  Exception,
  Validator,
  ErrorCodes,
  Helper,
  ErrorMessage,
  Models: {Customer}
} = require('common')
// eslint-disable-next-line new-cap
const Router = require('express').Router()

const _Helper = require('./helper')

/**
 *  create a customer record in the paystack account
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function(error, data)} done
 */
const create = function(req, res, done) {
  const customer = new Customer(req.body)
  console.log(customer)
  if (customer.email && Validator.email(customer.email)) {
    Paystack.customer
        .create(customer)
        .then((result) =>_Helper.handleResponse( res, done, null, result))
        .catch((err) => _Helper.handleResponse( res, done, err))
  } else {
    done(
        new Exception(
            ErrorMessage.INVALID_EMAIL,
            ErrorCodes.INVALID_MAIL
        )
    )
  }
}

/**
 *  updates a customer record in the paystack account
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function(error, data)} done
 */
const update = function(req, res, done) {
  const customer = new Customer(req.body)
  if (customer.email && Validator.email(customer.email)) {
    customer.id = customer.email
    Paystack.customer
        .update(customer)
        .then((result) =>_Helper.handleResponse( res, done, null, result))
        .catch((err) => _Helper.handleResponse( res, done, err))
  } else {
    done(
        new Exception(
            ErrorMessage.INVALID_EMAIL,
            ErrorCodes.INVALID_MAIL
        )
    )
  }
}


/**
 *  get a customer record in the paystack account
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function(error, data)} done
 */
const get = function(req, res, done) {
  const {params: {email}} = req
  // console.log(email)

  if (email && Validator.email(email)) {
    Paystack.customer
        .get({id: email})
        .then((result) =>_Helper.handleResponse( res, done, null, result))
        .catch((err) => _Helper.handleResponse( res, done, err))
  } else {
    done(
        new Exception(
            ErrorMessage.INVALID_EMAIL,
            ErrorCodes.INVALID_MAIL
        )
    )
  }
}


/**
 *  get a customer record in the paystack account
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function(error, data)} done
 */
const getAll = function(req, res, done) {
  if (Helper.isAdmin(req)) {
    Paystack.customer
        .list({})
        .then((result) =>_Helper.handleResponse( res, done, null, result))
        .catch((err) => _Helper.handleResponse( res, done, err))
  } else {
    done(
        new Exception(
            ErrorMessage.NO_PRIVILEGE,
            ErrorCodes.NO_PRIVILEGE
        )
    )
  }
}


/**
 *  deactivates any saved auth codes
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function(error, data)} done
 */
const deactivateAuth = function(req, res, done) {
  const {body: {authorizationCode}} = req
  console.log(authorizationCode)
  if (authorizationCode) {
    Paystack.customer
        .deactivateAuth({authorization_code: authorizationCode})
        .then((result) => res.status(200).json({result}))
        .catch((err) => _Helper.handleResponse( res, done, err))
  } else {
    done(
        new Exception(
            'Invalid Authorization code',
            ErrorCodes.INVALID_MAIL
        )
    )
  }
  // Paystack.customer.deactivateAuth({authorization_code})
  //     .then((data) => done(null, data))
  //     .catch((err) => done(err))
}

Router
    .get('/:email', get)
    .get('/', getAll)
    .post('/', create)
    .put('/', update)
    .delete('/', deactivateAuth)

module.exports = Router
