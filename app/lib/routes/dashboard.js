const router = require("express").Router();
const { user } = require("../controllers/auth");
const ContactController = require("../controllers/contact");
const ResourceController = require("../controllers/resource");
const ArticleController = require("../controllers/article");
const AgentController = require("../controllers/agent");
const QuestionController = require("../controllers/question");
const ReviewController = require("../controllers/review");
const { PageAnalyticsService, Logger } = require("common");
const Log = new Logger('App:dashboard')

router
    // All endpoints after this are Authenticated
    .use((req, res, next) => {
        if (!(req.isAuthenticated() && req.user)) return res.redirect("/login");
        next();
    })
    .get("/", user, AgentController.profile, ReviewController.analysisForAgent, ResourceController.random, (req, res) => {
        res.clearCookie('redirect-to')
        res.render("dashboard/dashboardhome", {
            locals: req.locals,
            page_name: "dashboard",
            sub_page_name: "dashboard",
        });
        PageAnalyticsService.inc('/dashboard')
        Log.info("user>>>", req.locals);
    })

    .get("/messages", user, AgentController.getAgentMessages, (req, res) => {
        res.render("dashboard/dashboardmessages", {
            locals: req.locals,
            page_name: "messages",
            sub_page_name: "messages",
        });
        PageAnalyticsService.inc('/dashboard/messages')
        Log.info("locals",  req.locals.agentMessage);
    })
    .get("/messages/:id", user, AgentController.getAgentMessage, (req, res) => {
        res.render("dashboard/singleMessage", {
            locals: req.locals,
            page_name: "messages",
            sub_page_name: "messages",
        });
        PageAnalyticsService.inc('/dashboard/messages/:id')
        Log.info("locals", req.locals);
    })
    .get("/my-articles", user, ArticleController.agentArticles, (req, res) => {
        res.render("dashboard/dashboardarticle", {
            locals: req.locals,
            page_name: "articles",
            sub_page_name: "myArticles",
        });
        PageAnalyticsService.inc('/dashboard/my-articles')
        Log.info("articles>>>", req.locals);
    })
    .get("/account-settings", user, AgentController.profile, (req, res) => {
        res.render("dashboard/account-setup", {
            locals: req.locals,
            page_name: "account",
            sub_page_name: "account",
        });
        PageAnalyticsService.inc('/dashboard/account-settings')
        Log.info("req.locals", req.locals.agentProfile);
    })

    .get("/help", user, (req, res) => {
        res.render("dashboard/faqs", {
            locals: req.locals,
            page_name: "help",
            sub_page_name: "help",
        });
        PageAnalyticsService.inc('/dashboard/help')
    })
    .get("/submit-answer/:id", user, QuestionController.get, (req, res) => {
        res.render("dashboard/submitAnswer", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "answer",
        });
        PageAnalyticsService.inc('/dashboard/submit-answer')
        Log.info("locals>>>", req.locals);
    })
    .get("/create-article", user, (req, res) => {
        res.render("dashboard/createArticle", {
            locals: req.locals,
            page_name: "articles",
            sub_page_name: "newArticle",
        });
        PageAnalyticsService.inc('/dashboard/create-article')
        Log.info("locals", req.locals);
    })
    .get("/answer-questions", user, QuestionController.getAll, (req, res) => {
        res.render("dashboard/answerQuestion", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "answer",
        });
        PageAnalyticsService.inc('/dashboard/answer-questions')
        Log.info("question",  req.locals.questions.data);
    })
    .get("/my-answers", user, QuestionController.myAnswers, (req, res) => {
        res.render("dashboard/dashboardQ&A", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "myAnswers",
        });
        PageAnalyticsService.inc('/dashboard/my-answers')
        Log.info("answers!!!>>>",  req.locals.myAnswers);
    })
    .get("/my-leads", user, (req, res) => {
        res.render("dashboard/clientLeads", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "myLeads",
        });
        PageAnalyticsService.inc('/dashboard/my-leads')
    })


module.exports = router
