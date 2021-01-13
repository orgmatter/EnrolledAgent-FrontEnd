const router = require("express").Router();

const CityController = require("../controllers/city");
const { verify } = require("../controllers/auth");
const ContactController = require("../controllers/contact");
const ResourceController = require("../controllers/resource");
const ArticleController = require("../controllers/article");
const AgentController = require("../controllers/agent");
const QuestionController = require("../controllers/question");
const ReviewController = require("../controllers/review");


const checkRedirectCookie = (req, res, next) => {
    const path = req.cookies['redirect-to']
    if (path)
        res.clearCookie('redirect-to')

    if (path && path.length > 1) return res.redirect(path)
    next()

}

router

    .get("/career-center", (req, res) => {
        res.render("careerCenter", { locals: req.locals });
    })
    .get("/contact", (req, res) => {
        res.render("contact", { locals: req.locals });
    })
    .get("/about-us", (req, res) => {
        res.render("about", { locals: req.locals });
    })
    .get("/privacy", (req, res) => {
        res.render("privacy", { locals: req.locals });
    })
    .get("/terms", (req, res) => {
        res.render("terms", { locals: req.locals });
    })
    .get("/unsubscribe", ContactController.unsubscribe)
    .get("/verify/:token", verify)

    // .get('/linkedin/callback', passport.authenticate('linkedin'), handleSocial)
    // .get('/google/callback', passport.authenticate('google', { scope: ['profile', 'email'], }), handleSocial)

    .get("/blog", ArticleController.getAll, (req, res) => {
        // console.log("articles>>>", req.locals);
        res.render("blog", { locals: req.locals });
    })
    .get("/blog/:id", ArticleController.get, (req, res) => {
        // console.log("articles>>>", req.locals);
        res.render("singleBlog", { locals: req.locals.article });
    })
    .get("/ea-listings", AgentController.getAll, (req, res) => {
        console.log("locals are", req.locals.agents);
        res.render("ea-listings", { locals: req.locals });
    })
    .get(
        "/find-agent",
        CityController.get,
        AgentController.popular,
        ResourceController.random,
        (req, res) => {
            res.render("find-agent", { locals: req.locals });
        }
    )
    .get("/search-results", AgentController.getAll, (req, res) => {
        console.log("locals ", req.locals.agents.data);
        res.render("search-results", { locals: req.locals });
    })

    .get(
        "/",
        checkRedirectCookie,
        CityController.get,
        AgentController.popular,
        ResourceController.random,
        (req, res) => {
            // console.log(req.locals)
            //  console.log("locals", req.app.locals);
            // extract message if this page was redirected to from another page
            if (req.app.locals && req.app.locals.message)
                req.locals.infoMessage = req.app.locals.message;
            delete req.app.locals.message
            res.render("home", { locals: req.locals });
        }
    )
    .get("/claim-listing", (req, res) => {
        res.render("listings", { locals: req.locals });
    })
    .get("/ask-ea", QuestionController.getAll, (req, res) => {
        console.log("questions", req.params);
        res.render("askEA", { locals: req.locals });
    })
    .get("/ask-ea/:category", QuestionController.getAll, (req, res) => {
        console.log("params", req.params);
        res.render("askEACategory", {
            locals: req.locals,
            name: req.params.category
        });
    })
    .get("/new-question", QuestionController.getAll, (req, res) => {
        console.log("cate", req.locals);
        res.render("newQuestions", { locals: req.locals });
    })
    .get("/agent/:id", ReviewController.analysis, AgentController.get, (req, res) => {
        console.log("agent>>>>", req.locals);
        // console.log("agent>>>>det", req.locals);
        res.render("single-agent-details", { locals: req.locals });
    })
    .get(
        "/agents/all-states",
        CityController.allStates,
        CityController.get,
        AgentController.get,
        (req, res) => {
            // console.log(req.locals);
            res.render("states", { locals: req.locals });
        }
    )
    .get(
        "/agents/:state",
        CityController.state,
        CityController.forState,
        AgentController.popularInState,
        AgentController.get,
        (req, res) => {
            // console.log(req.locals);
            res.render("single-state", { locals: req.locals });
        }
    )
    .get("/agents/:state/:city", AgentController.city, (req, res) => {
        // console.log(req.locals);
        res.render("city", { locals: req.locals });
    }) 
    .get("/offshore-team", (req, res) => {
        res.render("offshoreTeam", { locals: req.locals });
    })
    .get(
        "/resource",
        CityController.get,
        ResourceController.getAll,
        (req, res) => {
            // console.log(req.locals.resource)
            res.render("resource", {
                name: "Resources",
                description: 'Valuable services, products, tools, and whitepapers from our partners, hand selected by our staff.',
                locals: req.locals,
            });
        }
    )
    .get(
        "/resource/:category",
        CityController.get,
        ResourceController.getAll,
        (req, res) => {
            let description = ''
            let name = ''
            if (req.locals.category && req.locals.category.description)
                description = req.locals.category.description
            if (req.locals.category && req.locals.category.name)
                name = req.locals.category.name
            res.render("resource", {
                name,
                description,
                locals: req.locals,
            });
        }
    ) 
    .get("/practice-exchange", CityController.get, (req, res) => {
        res.render("practiceExchange", { locals: req.locals });
    })
    .get(
        "/states/:state",
        CityController.get,
        AgentController.popular,
        (req, res) => {
            // console.log("data>>>>>", req.locals);
            res.render("singleFirm", { locals: req.locals });
        }
    )
    .get(
        "/find-enrolled-agents",
        CityController.get,
        AgentController.popular,
        (req, res) => {
            res.render("find-agent", { locals: req.locals });
        }
    )
    .get("/need-accountant", (req, res) => {
        res.render("need-accountant", { locals: req.locals });
    })
    .get("/verification-service", (req, res) => {
        res.render("verification-service", { locals: req.locals });
    })

    .get("/license-verification", (req, res) => {
        console.log("license", req.locals);
        res.render("license-verification", { locals: req.locals });
    })
    .get("/claim-profile/:id", ReviewController.analysis, AgentController.get, (req, res) => {
        console.log("listing >>>", req.locals);
        res.render("claim-profile", { 
            locals: req.locals,
        });
    })
    


module.exports = router
