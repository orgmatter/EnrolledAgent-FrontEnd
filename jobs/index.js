require('dotenv').config({path: '../.env'})
require('debug')('porple:jobs')
require('./lib')
const {
  Events,
  PubSub,
  LogService,
  MailService,
  Logger
} = require('common')

const log = new Logger('jobs')

this.secret = process.env.PUB_SUB_SECRET || ''

// PubSub.on(Events.EMAIL, (data) => {
//   log.info(JSON.stringify(data))
//   if (data && data.secret) {
//     new MailService(data.sender || 'noreply@agrisensefarms.com').sendMail(
//         data
//     )
//   }
// })

// PubSub.on(Events.LOG, (data) => {
//   log.info(JSON.stringify(data))
//   if (data && data.secret) LogService.save(data)
// })
