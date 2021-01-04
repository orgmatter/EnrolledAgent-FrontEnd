const { DB, Models: { Subscription, Company }, Validator } = require("common");
const BaseCron = require("./baseCron");

class RatingJob extends BaseCron {

    /**
       * for every company compute rating
       * @param {Number} page
       * @param {function} done
       */
    async runJob(page = 1, done) {
        this.getCompanies(
            page,
            1,
            {},
            async (err, result) => {
                if (err) {
                    console.log(err)
                    done(err)
                } else {
                    const { data, pages, page } = result
                    for (const company of data) {
                        if (company && company.review && company.review.length > 0)
                            await this.updateRating(company._id, company.review)
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
    async getCompanies(page = 1, perPage = 10, query, done) {
        DB.Paginate({}, done, Company, {
            perPage,
            query,
            page,
            projections: {
                createdAt: 0,
                updatedAt: 0
            },
            populate: 'review'
        }, (res) => done(null, res))
    }

    /**
     * updateRating
     * @param  {String} id
     * @param  {[Object]} review
     */
    async updateRating(id, review) {
        if (!review || review.length < 1) return
        let rating = 0
        // console.log(id)
        review.forEach((m) => {
            rating += Number(m.rating)
        })
        rating /= review.length

        await Company.findByIdAndUpdate(id, {
            rating
        }).exec()
    }
}

module.exports = new RatingJob()