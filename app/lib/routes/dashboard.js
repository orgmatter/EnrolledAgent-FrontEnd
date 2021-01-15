const router = require("express").Router();
const { user } = require("../controllers/auth");
const ContactController = require("../controllers/contact");
const ResourceController = require("../controllers/resource");
const ArticleController = require("../controllers/article");
const AgentController = require("../controllers/agent");
const QuestionController = require("../controllers/question");
const ReviewController = require("../controllers/review");

router
    // All endpoints after this are Authenticated
    .use((req, res, next) => {
        if (!(req.isAuthenticated() && req.user)) return res.redirect("/login");
        next();
    })
    .get("/", user, AgentController.profile, ReviewController.analysisForAgent, ResourceController.random,  (req, res) => {
        console.log("user>>>", req.locals);
        res.clearCookie('redirect-to')
        res.render("dashboard/dashboardhome", {
            locals: req.locals,
            page_name: "dashboard",
            sub_page_name: "dashboard",
        });
    })

    .get("/messages", user, (req, res) => {
        res.render("dashboard/dashboardmessages", {
            locals: req.locals,
            page_name: "messages",
            sub_page_name: "messages",
        });
    })
    .get("/my-articles", user, ArticleController.agentArticles, (req, res) => {
        console.log("articles>>>", req.locals);
        res.render("dashboard/dashboardarticle", {
            locals: req.locals,
            page_name: "articles",
            sub_page_name: "myArticles",
        });
    })
    .get("/account-settings", user, AgentController.profile, (req, res) => {
        console.log("req.locals", req.locals.agentProfile);
        res.render("dashboard/account-setup", {
            locals: req.locals,
            page_name: "account",
            sub_page_name: "account",
        });
    })

    .get("/help", user, (req, res) => {
        res.render("dashboard/faqs", {
            locals: req.locals,
            page_name: "help",
            sub_page_name: "help",
        });
    })
    .get("/submit-answer/:id", user, QuestionController.get, (req, res) => {
        console.log("locals>>>", req.locals);
        res.render("dashboard/submitAnswer", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "answer",
        });
    })
    .get("/create-article", user, (req, res) => {
        console.log("locals", req.locals);
        res.render("dashboard/createArticle", {
            locals: req.locals,
            page_name: "articles",
            sub_page_name: "newArticle",
        });
    })
    .get("/answer-questions", user, QuestionController.getAll, (req, res) => {
        console.log("question", req.locals.questions.data);
        res.render("dashboard/answerQuestion", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "answer",
        });
    })
    .get("/my-answers", user, QuestionController.myAnswers, (req, res) => {
        console.log("answers!!!>>>", req.locals.myAnswers);
        res.render("dashboard/dashboardQ&A", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "myAnswers",
        });
    })
    .get("/my-leads", user, (req, res) => {
        res.render("dashboard/clientLeads", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "myLeads",
        });
    })


module.exports = router
