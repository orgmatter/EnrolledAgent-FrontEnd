const { DB, Models: { Agent, Review, Firm }, Validator, Exception, ErrorCodes, ErrorMessage } = require("common")

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
        const { rating, message, agent, firm , email, firstName, lastName, city, state  } = req.body;
        let usr, type = 'agent'
        if(req.user && req.user.id) usr = req.user.id

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
        if(firm)type = 'firm'
        if (await Review.exists({ email, agent }))
            return next(new Exception("You have previously reviewd this " + type, ErrorCodes.REQUIRED));
            

        Review.create({ rating, message, agent, firm, user: usr, firstName, lastName, email, city, state })
        .then((doc) => {
            res.json({ data: { message: 'your rating was added successfully' } })
        })
    }


}

module.exports = new ReviewController()