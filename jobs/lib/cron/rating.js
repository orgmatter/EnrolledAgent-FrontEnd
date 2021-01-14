const { DB, Models: { Subscription, Agent }, Validator, Helper } = require("common");
const BaseCron = require("./baseCron");

class RatingJob extends BaseCron {

    /**
       * for every agent compute rating
       * @param {Number} page
       * @param {function} done
       */
    async runJob(page = 1, done) {
        this.getAgents(
            page,
            1,
            {},
            async (err, result) => {
                if (err) {
                    console.log(err)
                    done(err)
                } else {
                    const { data, pages, page } = result
                    for (let index = 0; index < data.length; index++) {
                        const agent = data[index]
                        // console.log(agent)
                        if (agent && agent.review && agent.review.length > 0)
                            await this.updateRating(agent._id, agent.review)
                        // await setTimeout(function () { }, 100)
                    }
                    // await Helper.delay(500)
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
    async getAgents(page = 1, perPage = 10, query, done) {
        DB.Paginate({}, done, Agent, {
            perPage,
            query,
            page,
            projections: {
                createdAt: 0,
                updatedAt: 0
            },
            populate: {path: 'review', select: {rating: 1}}
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
        console.log(id, review)
        review.forEach((m) => {
            rating += Number(m.rating)
        })
        rating /= review.length

        await Agent.findByIdAndUpdate(id, {
            rating
        }).exec()
        
    }
}

module.exports = new RatingJob()