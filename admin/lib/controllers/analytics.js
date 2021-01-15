const {
    Exception,
    ErrorCodes,
    LogAction,
    LogCategory,
    Validator,
    Helper,
    DB,
    Models: { Agent, User, AdminUser, AgentMessage, Article, ArticleCategory,
        Answer, City, ClaimListing, Comment, Config, Contact, EmailList,
        Faq, Offshore, LicenseVerification, Question, QuestionCategory,
        ResourceCategory, Resource, Sponsor,
        Transaction, State, Role, Review, ListingRequest, },
} = require("common")
const moment = require("moment")

const BaseController = require('../controllers/baseController');


class AnalyticsController extends BaseController {

    async getAll(req, res, next) {
        const { page, perpage, q, search } = req.query
        let query = Helper.extractQuery(req.query) || {}
        if (q) query = { $text: q }

        DB.Paginate(res, next, Agent, {
            perPage: perpage,
            query,
            page,
            populate: [{ path: 'reviewCount', select: ['rating'] }, { path: 'owner', select: ['_id', 'firstName'] }]
        }, (data) => {
            super.handleResultPaginated(data, res, next)
        })

    }

    async get(req, res, next) {

        const fiveDaysAgo = moment().subtract({days: 5})
        const twentyFourHoursAgo = moment().subtract({hours: 24})
        // console.log(fiveDaysAgo, twentyFourHoursAgo)
       

        Promise.allSettled([
            Agent.estimatedDocumentCount().exec(),
            User.estimatedDocumentCount().exec(),
            Agent.countDocuments({owner: {$exists: true}}).exec(),
            Agent.countDocuments({$or: [ {transaction: {$exists: true}},  {adminPremium: true} ]}).exec(),
            Review.estimatedDocumentCount().exec(),
            Agent.countDocuments({createdAt: {$gt: fiveDaysAgo}}).exec(),
            User.countDocuments({createdAt: {$gt: fiveDaysAgo}}).exec(),
            User.countDocuments({createdAt: {$gt: twentyFourHoursAgo}}).exec(),
            EmailList.countDocuments({unsubscribed: false}).exec(),
            EmailList.countDocuments({unsubscribed: true}).exec(),
            Article.estimatedDocumentCount().exec(),
            Resource.estimatedDocumentCount().exec(),
            ListingRequest.estimatedDocumentCount().exec(),
            Sponsor.estimatedDocumentCount().exec(),
            ListingRequest.countDocuments({status: 'pending'}).exec(),
            Transaction.estimatedDocumentCount().exec(),
            Transaction.countDocuments({$or: [{status: 'succeeded'}, {status: 'requires_payment_method'}]}).exec(),
            Transaction.countDocuments({status: 'succeeded'}).exec(),
            Transaction.countDocuments({status: 'failed'}).exec(),




            // Promise.reject(new Error('an error'))
        ])
        .then((result)=> {
            console.log(result)
            super.handleResult({
                totalAgents: result[0].value,
                totalUsers: result[1].value,
                claimedListing: result[2].value,
                premiumAgents: result[3].value,
                totalReviews: result[4].value,
                newAgents: result[5].value,
                newUsers5Days: result[6].value,
                newUsers24Hours: result[7].value,
                mailingList: result[8].value,
                unsubscribedFromMailingList: result[9].value,
                totalArticles: result[10].value,
                totalResources: result[11].value,
                listingRequests: result[12].value,
                totalSponsors: result[13].value,
                claimRequests: result[14].value,
                totalPayments: result[15].value,
                pendingPayments: result[16].value || 0,
                succesfulPayments: result[17].value,
                failedPayments: result[18].value,
            }, res, next)
        })
        

    }

    async article(req, res, next) {

        const fiveDaysAgo = moment().subtract({days: 5})
        const twentyFourHoursAgo = moment().subtract({hours: 24})
        // console.log(fiveDaysAgo, twentyFourHoursAgo)
       

        Promise.allSettled([
            Article.estimatedDocumentCount().exec(),
            Article.countDocuments({createdAt: {$gt: fiveDaysAgo}}).exec(),
            Article.countDocuments({createdAt: {$gt: twentyFourHoursAgo}}).exec(),
            Article.countDocuments({status: 'pending'}).exec(),
            Article.countDocuments({status: 'approved'}).exec(),
            Article.countDocuments({status: 'rejected'}).exec(),
            Article.countDocuments({featured: true}).exec(),
            Article.countDocuments({sponsor: {$exists: true}}).exec(),
            Article.countDocuments({agent: {$exists: true}}).exec(),
            Article.countDocuments({byAdmin:  true}).exec(),
            ArticleCategory.estimatedDocumentCount().exec(),

        ])
        .then((result)=> {
            super.handleResult({
                totalArticles: result[0].value,
                newArticles5Days: result[1].value,
                newArticles24Hours: result[2].value,
                pendingArticles: result[3].value,
                approvedArticles: result[4].value,
                rejectedArticles: result[5].value,
                featuredArticles: result[6].value,
                sponsoredArticles: result[7].value,
                articlesByAdmin: result[8].value,
                articlesByAgents: result[9].value,
                totalArticleCategory: result[10].value,
                
                
            }, res, next)
        })
        

    }

    async resource(req, res, next) {

        const fiveDaysAgo = moment().subtract({days: 5})
        const twentyFourHoursAgo = moment().subtract({hours: 24})
        // console.log(fiveDaysAgo, twentyFourHoursAgo)
       

        Promise.allSettled([
            Resource.estimatedDocumentCount().exec(),
            Resource.countDocuments({createdAt: {$gt: fiveDaysAgo}}).exec(),
            Resource.countDocuments({createdAt: {$gt: twentyFourHoursAgo}}).exec(),
            ResourceCategory.estimatedDocumentCount().exec(),

        ])
        .then((result)=> {
            super.handleResult({
                totalResources: result[0].value,
                newResources5Days: result[1].value,
                newResources24Hours: result[2].value,
                totalArticleCategory: result[3].value,
                
                
            }, res, next)
        })
        

    }

    async question(req, res, next) {

        const fiveDaysAgo = moment().subtract({days: 5})
        const twentyFourHoursAgo = moment().subtract({hours: 24})
        // console.log(fiveDaysAgo, twentyFourHoursAgo)
       

        Promise.allSettled([
            Question.estimatedDocumentCount().exec(),
            Question.countDocuments({createdAt: {$gt: fiveDaysAgo}}).exec(),
            Question.countDocuments({createdAt: {$gt: twentyFourHoursAgo}}).exec(),
            QuestionCategory.estimatedDocumentCount().exec(),

        ])
        .then((result)=> {
            super.handleResult({
                totalQuestions: result[0].value,
                newQuestions5Days: result[1].value,
                newQuestions24Hours: result[2].value,
                totalQuestionCategory: result[3].value,
                
                
            }, res, next)
        })
        

    }

}


module.exports = new AnalyticsController()
