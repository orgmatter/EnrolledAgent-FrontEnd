const {StoreAuth} = require('../models')
const JwtManager = require('../service/jwtManager')
const ErrorMessage = require('../utils/errorMessage')
const ErrorCodes = require('../utils/errorCodes')
const Exception = require('../utils/exception')

const decodePin = (id, encrypted)=> {
  return new JwtManager(id).cryptr.decrypt(encrypted)
}

const encodePin = (id, pin)=> {
  return new JwtManager(id).cryptr.encrypt(pin)
}

exports.verifyPin = async (req, res, next)=> {
  // console.log(req.headers)
  const {
    headers: {pin},
    user: {id}
  } = req
  const auth = await StoreAuth.findOne({user: id})
  if (auth) auth.pin = decodePin(id, auth.pin)
  // encryptData(pin)

  if (pin && auth && auth.pin === pin) next()
  else {
    res.status(402)
    next(
        new Exception(
            ErrorMessage.REQUIRED_PIN,
            ErrorCodes.REQUIRED_PIN
        )
    )
  }
}

exports.setPin = async (req, next)=> {
  const {body: {pin}, user: {id}} = req
  if (String(pin).trim().length == 4 && parseInt(pin) <=
  9999 && parseInt(pin) >= 0000) {
    const p = encodePin(id, String(pin).trim())
    let auth = await StoreAuth.findOne({user: id}).exec()
    // eslint-disable-next-line new-cap
    if (!auth) auth = await StoreAuth({user: id, pin: p})
    else auth.pin = p
    auth.save()
    // console.log(auth)
    next(null, {message: 'succesfully set new pin'})
  } else {
    next(
        new Exception(
            'Please provide a valid pin',
            ErrorCodes.REQUIRED_PIN
        )
    )
  }
}
