const { DB, Models: { Agent, Review }, Validator, Exception, ErrorCodes, ErrorMessage } = require("common")

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
        const { rating, message, agent, firm } = req.body;

        if (!Validator.isMongoId(agent) || !(await Agent.exists({ _id: agent })))
            return next(new Exception("Invalid request", ErrorCodes.REQUIRED));

        if (!rating || !Number(rating) || Number(rating) < 1 || Number(rating) > 5)
            return next(new Exception("Please select an appropriate rating", ErrorCodes.REQUIRED));

        if (!(req.isAuthenticated() && req.user && req.user.accountType == "customer"))
            return next(new Exception("You need to be loged in to rate a company", ErrorCodes.REQUIRED));

        if (await Review.exists({ user: req.user.id, agent }))
            return next(new Exception("You have previously reviewd this agent", ErrorCodes.REQUIRED));

        Review.create({ rating, message, agent, firm, user: req.user.id }).then((doc) => {
            res.json({ data: { message: 'your rating was added successfully' } })
        })
    }


}

module.exports = new ReviewController()