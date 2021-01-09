const {
  EmailTemplates,
  MailService,
  Validator,
  Models: { Transaction, LicenseVerification, Agent }
} = require('common')

const config = require('../config')
const Helper = require('./helper')
const Stripe = require("stripe")(config.STRIPE_SECRET_KEY);

const updateTransaction = async (data, isSucces = false) => {
  const { metadata } = data || {}
  if (data.metadata && data.metadata.purpose) {
    Transaction.findOneAndUpdate({ metadata }, data, { upsert: true, new: true })
      .then(async doc => {
        console.log('datatatta', doc)
        if (isSucces === true) {
          if (doc.licence && Validator.isMongoId(String(doc.licence))) {
            const licence = await LicenseVerification.findById(doc.licence).exec()
            licence.transaction = doc._id
            licence.save()
            console.log('licence', licence)
          } else if (doc.agent && Validator.isMongoId(String(doc.agent))) {
            const agent = await Agent.findById(doc.agent).exec()
            agent.transaction = doc._id
            console.log('agent', agent)
            agent.save()
          }
        }
      })
  }
}

module.exports = async (req, res) => {
  // console.log(req.headers)
  let event, data, eventType;
  if (config.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let signature = req.headers["stripe-signature"];
    try {
      event = Stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        config.STRIPE_WEBHOOK_SECRET
      );
       res.sendStatus(200);
    } catch (err) {
      console.log(err)
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    // data = req.body.data;
    // eventType = req.body.type;

    return res.sendStatus(401);
  }
  console.log(eventType, data.object)

 

  if (eventType === "payment_intent.succeeded") {
    updateTransaction(data.object, true)
    console.log("💰 Payment captured!");
   return 
  } else {
    console.log("❌ Payment failed.");
    updateTransaction(data.object)
  }



  // new MailService().sendMail({
  //   secret: config.PUB_SUB_SECRET,
  //   template: EmailTemplates.INFO,
  //   reciever: 'ekeh.wisdom@gmail.com',
  //   subject: 'Intruder Detected',
  //   locals: {
  //     name: admin,
  //     message: `an intruder was detected. \n ip: ${JSON.stringify(
  //         req.ips
  //     )}. \n params: ${JSON.stringify(
  //         req.params
  //     )}  \n query: ${JSON.stringify(
  //         req.query
  //     )}  \n body: ${JSON.stringify(req.body)}`
  //   }
  // })
  // }
}
