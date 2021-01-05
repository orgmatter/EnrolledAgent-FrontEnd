const {
  Events,
  Logger,
  LogAction,
  LogCategory,
  PubSub,
  EmailTemplates,
  DB,
  Constants,
  Models: {LogModel, Transaction}
} = require('common')
// const moment = require('moment')
const Payment = require('payment_module')
const secret = process.env.PUB_SUB_SECRET || ''
const moment = require('moment')

const log = new Logger()

/**
 * Manache calculating investment
 */
class TransactionJob {
  /**
   * save a package
   * @param  {object} body
   * @param  {function} done
   */
  async savePackage(body, done) {
    Transaction.findByIdAndUpdate(body.id, body, {
      createdAt: 0,
      updatedAt: 0
    })
        .then((doc) => done(null, doc))
        .catch((err) => done(err, null))
  }

  /**
   * get Transactions
   * @param  {Number} page
   * @param  {Number} perPage
   * @param  {object} query
   * @param  {function} done
   */
  async getTransaction(page, perPage, query, done) {
    // eslint-disable-next-line new-cap
    DB.Paginate({json: (res) => done(null, res)}, done, Transaction, {
      perPage,
      query,
      page,
       
    },  (res)=> done(null, res))
  }

  /**
   * find packages and calculate interests,
   * collate the total
   * @param {Number} page
   * @param {function} done
   */
  async runJob(page = 1, done) {
    // console.log('running job', page)
    // get all pending transaction
    this.getTransaction(
        page,
        100,
        {status: Constants.TRASACTION_STATUS.pending},
        async (err, result) => {
          if (err) {
        console.log(err)
           
            done(err)
          } else {
          // console.log(result.total)
            const {data, pages, page} = result
            for (const transaction of data) { 
              // console.log(Math.abs(moment().valueOf() - moment(transaction.createdAt).valueOf() ), 60 * 5 * 1000)
              // if(Math.abs(moment().valueOf() - moment(transaction.createdAt).valueOf() ) > (60 * 5 * 1000))
              this.verifyTransaction(transaction)
              // wait for a second before verifying another transaction
              await setTimeout(function() {}, 1000)
            }
            await setTimeout(function() {}, 5000)
            if (pages > page) {
            // console.log('running job again', page)
              this.runJob(page + 1, done)
            } else done()
          }
        }
    )
  }
  /**
   * verify a transaction
   * @param  {object} transaction
   * @param  {function} done
   * @return  {object}
   */
  async verifyTransaction(transaction) {
    const {id, reference, status} = transaction
    Payment.verifyTransaction({reference}, (err, res) => {
      if (res) {
      log.info(res)
      }
    })
  }

}

module.exports = new TransactionJob()
