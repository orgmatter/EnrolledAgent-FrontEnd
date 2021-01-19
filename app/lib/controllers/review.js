const { DB, Models: { Agent, Review, Firm }, Validator, Exception, ErrorCodes, ErrorMessage } = require("common")
const { Types } = require("mongoose")

/**
* Manage Review
*/
class ReviewController {


    /**
    * write reviews for a an agent or firm
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
    createReview = async function (req, res, next) {
        const { rating, message, agent, firm, email, firstName, lastName, city, state } = req.body;
        let usr, type = 'agent'
        if (req.user && req.user.id) usr = req.user.id

        if (!email || !Validator.email(email))
            return next(new Exception("Please input a valid email", ErrorCodes.REQUIRED));

        if (!agent && !firm)
            return next(new Exception("Invalid request", ErrorCodes.REQUIRED));

        if (agent && (!Validator.isMongoId(agent) || !(await Agent.exists({ _id: agent }))))
            return next(new Exception("Invalid request", ErrorCodes.REQUIRED));

        if (firm && (!Validator.isMongoId(firm) || !(await Firm.exists({ _id: firm }))))
            return next(new Exception("Invalid request", ErrorCodes.REQUIRED));

        if (!rating || !Number(rating) || Number(rating) < 1 || Number(rating) > 5)
            return next(new Exception("Please select an appropriate rating", ErrorCodes.REQUIRED));
        if (firm) type = 'firm'
        if (await Review.exists({ email, agent }))
            return next(new Exception("You have previously reviewd this " + type, ErrorCodes.REQUIRED));


        Review.create({ rating, message, agent, firm, user: usr, firstName, lastName, email, city, state })
            .then((doc) => {
                res.json({ data: { message: 'your rating was added successfully' } })
            })
    }


    /**
     * Get agent review
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {function} next
     */
    async agent(req, res, next) {
        req.locals.review = []
        if (!(req.isAuthenticated() && req.user))
            return next()

        let agent = await Agent.findOne({ owner: Types.ObjectId(req.user.id) }).exec()
        // console.log(agent, req.user.id)
        if (!agent || !agent._id) return next()

        const review = await Review.find({ agent: agent._id }).exec()

        req.locals.review = review;
        next();
    }


    /**
     * Breakdown rating for an agent
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {function} next
     */
    analysis = async function (req, res, next) {
        const { params: { id }, } = req;
        const agent = await Agent.findOne({ _id: id }).exec()

        if (agent && agent._id) {

            const one = await Review.countDocuments({ agent: agent._id, rating: 1 }).exec()
            const two = await Review.countDocuments({ agent: agent._id, rating: 2 }).exec()
            const three = await Review.countDocuments({ agent: agent._id, rating: 3 }).exec()
            const four = await Review.countDocuments({ agent: agent._id, rating: 4 }).exec()
            const five = await Review.countDocuments({ agent: agent._id, rating: 5 }).exec()
            const count = await Review.countDocuments({ agent: agent._id, }).exec()

            Review
                .aggregate([
                    { $match: { agent: agent._id } },
                    {
                        $group:
                        {
                            _id: null,
                            avgRating: { $avg: '$rating' },
                        },
                    },

                ])
                .then((doc) => {
                    // console.log(doc, one, two, three, four, five)
                    let avgRating = 0
                    if (doc && doc.length > 0 && doc[0].avgRating) {
                        avgRating = Number(doc[0].avgRating || 0).toPrecision(2)
                        avgRating = Number(avgRating)
                    }
                    req.locals.reviewAnalysis = { one, two, three, four, five, count, avgRating }
                    // console.log(req.locals.reviewAnalysis)
                    // if (doc && doc[0] && doc[0].count) req.locals.monthlySub = doc[0].count;
                    next();
                });
        } else next()
    };


    /**
     * Breakdown rating for a logged in agent
     * @param  {Express.Request} req
     * @param  {Express.Response} res
     * @param  {function} next
     */
    analysisForAgent = async function (req, res, next) {
        req.locals.reviewAnalysis = {}
        if (!(req.isAuthenticated() && req.user))
            return next()

        let agent = await Agent.findOne({ owner: Types.ObjectId(req.user.id) }).exec()
        if (!agent || !agent._id)
            return next()

        if (agent && agent._id) {

            const one = await Review.countDocuments({ agent: agent._id, rating: 1 }).exec()
            const two = await Review.countDocuments({ agent: agent._id, rating: 2 }).exec()
            const three = await Review.countDocuments({ agent: agent._id, rating: 3 }).exec()
            const four = await Review.countDocuments({ agent: agent._id, rating: 4 }).exec()
            const five = await Review.countDocuments({ agent: agent._id, rating: 5 }).exec()
            const count = await Review.countDocuments({ agent: agent._id, }).exec()

            Review
                .aggregate([
                    { $match: { agent: agent._id } },
                    {
                        $group:
                        {
                            _id: null,
                            avgRating: { $avg: '$rating' },
                        },
                    },

                ])
                .then((doc) => {
                    // console.log(doc, one, two, three, four, five)
                    let avgRating = 0
                    if (doc && doc.length > 0 && doc[0].avgRating) {
                        avgRating = Number(doc[0].avgRating || 0).toPrecision(2)
                        avgRating = Number(avgRating)
                    }
                    req.locals.reviewAnalysis = { one, two, three, four, five, count, avgRating }
                    // console.log(req.locals.reviewAnalysis)
                    // if (doc && doc[0] && doc[0].count) req.locals.monthlySub = doc[0].count;
                    next();
                });
        } else next()
    };



}

module.exports = new ReviewController()
