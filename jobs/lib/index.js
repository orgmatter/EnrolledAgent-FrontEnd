const RatingJob = require('./cron/rating')
const CacheJob = require('./cron/cache')
const moment = require('moment')
const CronJob = require('cron').CronJob
// const time = process.env.JOB
// console.log(time)
//  new CronJob(
//   '*/30 * * * *', // runs every 30 mins
//   async function () {
//     console.log('starting job', moment())
//     AdvertJob.runJob(1, function (err) {
//       console.log(' advert job finished', Date(), err)
//     })
//   },
//   null,
//   true
// ).start()

// new CronJob(
//   // '*/1 * * * *',
//   '0 */2 * * *', // runs every 2 hours
//   async function () {
//     console.log('starting Subscription job', moment())
//     SubscriptionJob.runJob(1, function (err) {
//       console.log('Subscription job finished', Date(), err)
//     })
//   },
//   null,
//   true
// ).start()

// new CronJob(
//   // '*/1 * * * *',
//   '0 */2 * * *', // runs every 2 hours
//   async function () {
//     console.log('starting CompanyJob job', moment())
//     CompanyJob.runJob(1, function (err) {
//       console.log('CompanyJob job finished', Date(), err)
//     })
//   },
//   null,
//   true
// ).start()


// new CronJob(
//   '*/5 * * * *', // runs every 5 minute
//   async function () {
//     console.log('starting transaction job', moment())
//     Transaction.runJob(1, function (err) {
//       console.log('transaction job finished', Date(), err)
//     })
//   },
//   null,
//   true
// ).start()

new CronJob(
  '*/15 * * * *', // runs every 5 minute
  async function () {
    console.log('starting Rating job', moment())
    RatingJob.runJob(1, function (err) {
      console.log('Rating job finished', Date(), err)
    })
  },
  null,
  true
).start()

new CronJob(
  '*/15 * * * *', // runs every 15 minute
  async function () {
    console.log('starting Cache job', moment())
    CacheJob.runJob(1, function (err) {
      console.log('Caching job finished', Date(), err)
    })
  },
  null,
  true
).start()

new CronJob(
  '*/59 * * * *', // runs every 29 minute
  async function () {
    console.log('starting Cache Flush job', moment())
    CacheJob.flushAll(function (err) {
      console.log('Flushed all keys', Date(), err)
    })
  },
  null,
  true
).start()


