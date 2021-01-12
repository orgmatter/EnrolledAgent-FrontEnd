const router = require("express").Router();
const { user } = require("../controllers/auth");

router
    // All endpoints after this are Authenticated
    .use((req, res, next) => {
        if (!(req.isAuthenticated() && req.user)) return res.redirect("/login");
        next();
    })
    .get("/", user, (req, res) => {
        // console.log("user>>>", req.locals);
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
    .get("/my-articles", user, (req, res) => {
        res.render("dashboard/dashboardarticle", {
            locals: req.locals,
            page_name: "articles",
            sub_page_name: "myArticles",
        });
    })
    .get("/account-settings", user, (req, res) => {
        res.render("dashboard/account-setup", {
            avatarUrl: "/assets/images/img-placeholder.jpg",
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
    .get("/submit-answer", user, (req, res) => {
        res.render("dashboard/submitAnswer", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "answer",
        });
    })
    .get("/create-article", user, (req, res) => {
        res.render("dashboard/createArticle", {
            locals: req.locals,
            page_name: "articles",
            sub_page_name: "newArticle",
        });
    })
    .get("/answer-questions", user, (req, res) => {
        res.render("dashboard/answerQuestion", {
            locals: req.locals,
            page_name: "ask",
            sub_page_name: "answer",
        });
    })
    .get("/my-answers", user, (req, res) => {
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
