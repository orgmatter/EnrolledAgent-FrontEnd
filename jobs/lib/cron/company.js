const { DB, Models: { Subscription, Company }, Validator } = require("common");
const BaseCron = require("./baseCron");

class CompanyJob extends BaseCron {

    /**
     * find completed packages and mark as completed
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
                        await this.updateSubStatus(company._id)
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
            }
        }, (res) => done(null, res))
    }

    /**
     * mark sub as completed
     * @param  {String} id
     * @param  {Number} perPage
     * @param  {object} query
     * @param  {function} done
     */
    async updateSubStatus(id) {
        const hasSub = await Subscription.exists({
            endDate: { $gt: new Date().valueOf() },
            company: id,
            package: { $exists: true }
        })

        await Company.findByIdAndUpdate(id, {
            hasSub
        }).exec()
    }
}

module.exports = new CompanyJob()