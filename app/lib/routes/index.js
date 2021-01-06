const router = require("express").Router();
const passport = require("passport");
const { Validator, Logger, Constants } = require("common");
const { app } = require("common/lib/middleware");
const CityController = require("../controllers/city");
const { handleSocial, verify, user } = require("../controllers/auth");
const ContactController = require("../controllers/contact");
const ResourceController = require("../controllers/resource");
const ArticleController = require("../controllers/article");
const AgentController = require("../controllers/agent");

const Log = new Logger("App:Router");

router
  .use((req, res, next) => {
    if (req.csrfToken) res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
  })
  .use("/api", require("./api"));

router
  .use((req, res, next) => {
    req.locals = { query: req.query };
    req.locals.pageTitle = "Home";
    if (
      req.isAuthenticated() &&
      req.user &&
      req.user.accountType == Constants.ACCOUNT_TYPE.user
    )
      req.locals.isAuthenticated = true;
    next();
  })

  .use((req, res, next) => {
    // console.log(req.isAuthenticated(), req.user)
    next();
  })

  .get("/facebook/callback", function (req, res, next) {
    passport.authenticate("facebook", function (err, user, info) {
      handleSocial(req, res, next, err, user, info);
    })(req, res, next);
  })
  .get("/google/callback", function (req, res, next) {
    passport.authenticate(
      "google",
      { scope: ["profile", "email"] },
      function (err, user, info) {
        handleSocial(req, res, next, err, user, info);
      }
    )(req, res, next);
  })
  .get("/linkedin/callback", function (req, res, next) {
    passport.authenticate("linkedin", function (err, user, info) {
      handleSocial(req, res, next, err, user, info);
    })(req, res, next);
  })
  .get("/career-center", (req, res) => {
    res.render("careerCenter");
  })
  .get("/contact", (req, res) => {
    res.render("contact");
  })
  .get("/about-us", (req, res) => {
    res.render("about");
  })
  .get("/unsubscribe", ContactController.unsubscribe)
  .get("/verify/:token", verify)
  .get("/dashboard", user, (req, res) => {
    // console.log("user>>>", req.locals);
    res.render("dashboard/dashboardhome", { 
      locals: req.locals,
      page_name: "dashboard",
      sub_page_name: "dashboard"
     });
  })

  .get("/dashboard/messages", user, (req, res) => {
    res.render("dashboard/dashboardmessages", { 
      locals: req.locals,
      page_name: "messages",
      sub_page_name: "messages"

    });
  })
  .get("/dashboard/my-articles", user, (req, res) => {
    res.render("dashboard/dashboardarticle", { 
      locals: req.locals,
      page_name: "articles",
      sub_page_name: "myArticles"
    });
  })
  // .get("/about-us", (req, res) => {
  //   res.render("about");
  // })
  .get("/dashboard/submit-answer", (req, res) => {
    res.render("dashboard/submitAnswer", { locals: req.locals });
  })
  .get("/dashboard/create-article",user, (req, res) => {
    res.render("dashboard/createArticle", { 
      locals: req.locals,
      page_name: "articles",
      sub_page_name: "newArticle"
     });
  })
  .get("/dashboard/answer-questions", user, (req, res) => {
    res.render("dashboard/answerQuestion", { 
      locals: req.locals,
      page_name: "ask",
      sub_page_name: "answer"
    });
  })
  .get("/dashboard/my-answers", user, (req, res) => {
    res.render("dashboard/dashboardQ&A", { 
      locals: req.locals ,
      page_name: "ask",
      sub_page_name: "myAnswers"
    });
  })
  .get("/dashboard/my-leads", user, (req, res) => {
    res.render("dashboard/clientLeads", { 
      locals: req.locals,
      page_name: "ask",
      sub_page_name: "myLeads"
    });
  })

  // .get('/linkedin/callback', passport.authenticate('linkedin'), handleSocial)
  // .get('/google/callback', passport.authenticate('google', { scope: ['profile', 'email'], }), handleSocial)

  .get("/blog", ArticleController.getAll, (req, res) => {
    // console.log("articles>>>", req.locals.articles.data);
    res.render("blog", { locals: req.locals });
  })
  .get("/blog/:id", ArticleController.get, (req, res) => {
    // console.log("articles>>>", req.locals);
    res.render("singleBlog", { locals: req.locals.article });
  })
  .get("/ea-listings", AgentController.getAll, (req, res) => {
    // console.log("locals are", req.locals.agents);
    res.render("ea-listings", { locals: req.locals });
  })
  .get(
    "/find-agent",
    CityController.get,
    AgentController.popular,
    (req, res) => {
      res.render("find-agent", { locals: req.locals });
    }
  )
  .get("/search-results", AgentController.getAll, (req, res) => {
    // console.log("locals ", req.locals);
    res.render("search-results", { locals: req.locals });
  })

  .get(
    "/",
    CityController.get,
    AgentController.popular,
    ResourceController.random,
    (req, res) => {
      // console.log("locals", req.locals);
      // extract message if this page was redirected to from another page
      if (req.app.locals && req.app.locals.message)
        req.locals.infoMessage = req.app.locals.message;
      res.render("home", { locals: req.locals });
    }
  )
  .get("/claim-listing", (req, res) => {
    res.render("listings");
  })
  .get("/ask-ea", (req, res) => {
    res.render("askEA");
  })
  .get("/agent/:id", AgentController.get, (req, res) => {
    // console.log("agent>>>>", req.locals);
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
  // .get("/city/:slug", AgentController.city, (req, res) => {
  //   console.log("locals ", req.locals);
  //   res.render("city", { locals: req.locals });
  // })
  .get("/offshore-team", (req, res) => {
    res.render("offshoreTeam");
  })
  .get(
    "/resource",
    CityController.get,
    ResourceController.getAll,
    (req, res) => {
      res.render("category", {
        name: "Resources",
        locals: req.locals,
      });
    }
  )
  .get(
    "/resource/:category",
    CityController.get,
    ResourceController.getAll,
    (req, res) => {
      res.render("category", {
        name: req.params.category,
        locals: req.locals,
      });
    }
  )
  // .get("/resources", ResourceController.getAll, (req, res) => {
  //   res.render("category");
  // })
  .get("/practice-exchange", CityController.get, (req, res) => {
    res.render("practiceExchange");
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
      res.render("find-agent");
    }
  )
  .get("/need-accountant", (req, res) => {
    res.render("need-accountant");
  })
  .get("/verification-service", (req, res) => {
    res.render("verification-service");
  })

  .get("/license-verification", (req, res) => {
    res.render("license-verification");
  })

  .get("/dashboard/account-settings", user, (req, res) => {
    res.render("account-setup", {
      avatarUrl: "/assets/images/img-placeholder.jpg",
      locals: req.locals,
      page_name: "account",
      sub_page_name: "account"
    });
  })

  .get("/dashboard/help",user, (req, res) => {
    res.render("faqs", {
      locals: req.locals,
      page_name: "help",
      sub_page_name: "help"
    });
  })
  .get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  })
  .get("/login", (req, res) => {
    if (req.isAuthenticated() && req.user) return res.redirect("/");
    res.render("login");
  })
  .get("/register", (req, res) => {
    if (req.isAuthenticated() && req.user) return res.redirect("/");
    res.render("signup");
  })

  // .get("/single-agent-details", (req, res) => {
  //   if (req.isAuthenticated() && req.user) return res.redirect("/");
  //   res.render("single-agent-details");
  // })

  // Authenticated Endpoints
  .use((req, res, next) => {
    if (!(req.isAuthenticated() && req.user)) return res.redirect("/login");
    next();
  })

  .get("/profile", user, (req, res) => {
    res.render("profile", { locals: req.locals });
  });

// catch 404
router.use((req, res) => {
  res.statusCode = 404;
  // console.log(req.url.split("/").pop());
  // res.render(req.path.split("/").pop(), { locals: req.locals }, (err, dat) => {
  res.render("page_404");
  // else res.send(dat);
  // });
});

// error handler
router.use((err, req, res, next) => {
  // if (err.code === 'EBADCSRFTOKEN') return res.status(403).json({ error: { message: 'Invalid Token', code: 8000 } })
  Log.info(err);
  console.log(err);
  Log.info(req.headers);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};
  res.status(err.status || 500);
  res.render("page_500");
});

module.exports = router;
