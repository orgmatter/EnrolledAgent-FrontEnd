const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  Constants,
  Validator,
  Helper,
  EmailTemplates,
  Models: { Transaction, Advert, Subscription, Package, Company, Config }
} = require('common')

const camelCase = require('camelize')
const moment = require('moment')
//const { strictEqual } = require('should')
// const config = require('../config')

exports.handleResponse = (res, next, err, result) => {
  // console.log(err, result)
  if (err) {
    const { error } = err
    // console.log(err.error)
    if ('data' in error) {
      let { data } = error
      data = camelCase(data)
      return res.status(200).json({ data })
    }
    // if (error.errno == 'EAI_AGAIN') {
    return next(
      error || { error: { message: err.message, status: err.status } }
    )
  }
  if (result.status == true && 'data' in result) {
    let { data } = result
    data = camelCase(data)
    // console.log(data)
    // const {status, gatewayResponse} = data
    res.status(200).json({ data })
    // next(data)
  } else {
    next(new Exception(ErrorMessage.UNKNOWN, ErrorCodes.UNKNOWN))
  }
}

exports.chargeSucces = async (data) => {
  const d = camelCase(data)
  const {
    reference,
    status,
    paidAt,
    createdAt,
    channel,
    currency
  } = d
  Transaction.findOneAndUpdate(
    { reference: reference },
    {
      status,
      paidAt: paidAt ? new Date(paidAt) : null,
      createdAt: new Date(createdAt),
      channel,
      currency
    },
    { new: true },
    async (err, transaction) => {
      // console.log('hjdfgwasjkhfaekdhfakgdh', err, transaction)
      if (transaction.status === Constants.TRASACTION_STATUS.success) {
        const { advert, package, units, company, _id } = transaction
        let type
        let duration
        if (advert) {
          const a = await Advert.findById(advert)
          if (a) duration = a.duration
          if (a) type = a.type
        } else if (package) {
          const a = await Package.findById(package)
          if (a) duration = a.duration
          if (a) type = 'package'
        }


        let sub = await Subscription.find({
          endDate: { $gt: new Date().valueOf() },
          company: company,
          package: { $exists: true },
        });
       
        let _sub
        if (package && (sub != null && sub.length > 0)){
          _sub = sub[0]
        sub.forEach(s => {
          console.log(s, _sub)
          if(s.endDate > _sub.endDate)_sub = s
        })
       

        }
           
        let startDate = moment().valueOf()
        // console.log('startDate', startDate)
        if(_sub && _sub.endDate ) startDate = _sub.endDate
        let endDate = Helper.calculateEndDate(duration, startDate)
        // if (duration == 'monthly')
        //   endDate = moment().add({ month: 1 * (Number(units) || 1) })
        // else if (duration == 'yearly')
        //   endDate = moment().add({ year: 1 * (Number(units) || 1) })
        // else if (duration == 30)
        //   endDate = moment().add({ month: 1 * (Number(units) || 1) })
        // else if (Number(duration))
        //   endDate = moment().add({
        //     day: Number(duration) * (Number(units) || 1)
        //   })
        console.log('startDate', startDate, endDate)
        if (await Subscription.exists({ transaction: transaction._id }))
          return

        const p = await Package.findById(package).exec()
        let config
        if (p)
          config = new Config(p)

        Subscription.create({
          endDate,
          company,
          startDate,
          advert,
          package,
          config,
          type,
          transaction: _id
        }).then((doc) => {
          // console.log(doc)
          if (doc.package) {
            Company.findByIdAndUpdate(doc.company, { hasSub: true })
              .exec()
          }
        })
      }
    }
  )
}
