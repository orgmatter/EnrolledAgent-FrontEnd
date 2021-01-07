const {
  EmailTemplates,
  MailService,
} = require('common')

const config = require('../config')
const helper = require('./helper')
const crypto = require('crypto')
const stripe = require("stripe")(config.STRIPE_SECRET);

module.exports = async (req, res) => {
  if (config.STRIPE_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event, data, eventType;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        config.STRIPE_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  console.log(eventType, data)

  if (eventType === "payment_intent.succeeded") {
    // helper.chargeSucces(req.body.data, req, res)
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
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
