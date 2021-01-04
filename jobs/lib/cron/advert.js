const { DB, Models: { Subscription }, Validator } = require("common");
const BaseCron = require("./baseCron");

class AdvertJob extends BaseCron {

  /**
   * find completed packages and mark as completed
   * @param {Number} page
   * @param {function} done
   */
  async runJob(page = 1, done) {
    this.getAdvert(
      page,
      1,
      { status: 'active', company: { $exists: true },
      advert: { $exists: true } },
      async (err, result) => {
        if (err) {
          console.log(err)

          done(err)
        } else {
          // console.log(result)
          const { data, pages, page } = result
          for (const ad of data) {
            // console.log(ad)
            if(Validator.isMongoId(ad.id) && Date.now().valueOf() > (ad.endDate || 0))
            this.completeSub(ad.id)
            // this.verifyTransaction(transaction)
            // wait for a second before verifying another transaction
            await setTimeout(function () { }, 1000)
          }
          await setTimeout(function () { }, 5000)
          if (pages > page) {
            // console.log('running job again', page)
            this.runJob(page + 1, done)
          } else done()
        }
      }
    )
  }


  /**
   * get adverts
   * @param  {Number} page
   * @param  {Number} perPage
   * @param  {object} query
   * @param  {function} done
   */
  async getAdvert(page = 1, perPage = 10, query, done) {
    DB.Paginate({}, done, Subscription, {
      perPage,
      query,
      page,
      projections: {
        createdAt: 0,
        updatedAt: 0
      }
    }, (res)=> done(null, res))
  }

  /**
   * mark sub as completed
   * @param  {String} id
   * @param  {Number} perPage
   * @param  {object} query
   * @param  {function} done
   */
  async completeSub(id) {
    Subscription.findByIdAndUpdate(id, {status: 'completed'})
    .then(()=>{})
  }
}

module.exports = new AdvertJob()