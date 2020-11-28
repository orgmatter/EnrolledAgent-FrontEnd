const Email = require('email-templates')
const nodemailer = require('nodemailer')
const assert = require('assert')
const mg = require('nodemailer-mailgun-transport')
const config = require('../config')

assert.ok(config.EMAIL_ROOT_FOLDER, 'Email root folder must be defined in environment variables')

const mgTransport = mg({
  auth: {
    api_key: config.MAIL_API_KEY,
    domain: config.MAIL_DOMAIN_URL
  }
  // proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
})

const baseurl = config.APP_URL

const client = nodemailer.createTransport(mgTransport)
/**
 * Handles sending mail with mailgun api
 */
class MailService {
  /**
   * @param  {string} sender
   */
  constructor(sender) {
    this.sender = sender
    this.email = new Email({
      message: {
        from: sender || config.DEFAULT_EMAIL_SENDER
      },
      // send: true,
      transport: client,
      views: {
        root: config.EMAIL_ROOT_FOLDER,
        options: {
          extension: 'ejs'
        }
      }
    })
  }
  /**
   * @param  {object} data
   * @param {function} done
   */
  sendMail(data, done) {
    if(!data.locals.email)
    data.locals.email = data.reciever
    data.locals.baseurl = baseurl
    this.email
        .send({
          template: data.template || 'welcome',
          message: {
            to: data.reciever || 'ekeh.wisdom@gmail.com',
            subject: data.subject || '',
            headers: data.headers
          },
          locals: data.locals || {}
        })
        .then((res)=> done(null, res))
        .catch((err)=> done(err))
  }
}

module.exports = MailService
