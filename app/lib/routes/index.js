const router = require("express").Router();
const passport = require("passport");
const { Validator, Logger, Constants } = require("common");
const { app } = require("common/lib/middleware");
const CityController = require("../controllers/city");
const { handleSocial, verify, user } = require("../controllers/auth");
const ContactController = require("../controllers/contact");
const ResourceController = require("../controllers/resource");
const ArticleController = require("../controllers/article");

const Log = new Logger("App:Router");

router
  .use((req, res, next) => {
    // console.log( req.isAuthenticated())
    // console.log(req.session)
    req.locals = {}
    if (req.csrfToken)
      res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
  })
  .use("/api", require("./api"))

router.use((req, res, next) => {
  req.locals = {};
  req.locals.pageTitle = "Home";
  if (req.isAuthenticated() && req.user && req.user.accountType == Constants.ACCOUNT_TYPE.user)
    req.locals.isAuthenticated = true;
  next();
});

router
  .use((req, res, next) => {
    console.log(req.isAuthenticated(), req.user);
    //   console.log(req.body, req.params)
    next();
  })

  .get("/facebook/callback", function (req, res, next) {
    passport.authenticate("facebook", function (err, user, info) {
      handleSocial(req, res, next, err, user, info);
    })(req, res, next);
  })
  .get("/google/callback", function (req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] }, function (err, user, info) {
      handleSocial(req, res, next, err, user, info);
    })(req, res, next);
  })
  .get("/linkedin/callback", function (req, res, next) {
    passport.authenticate("linkedin", function (err, user, info) {
      handleSocial(req, res, next, err, user, info);
    })(req, res, next);
  })

  .get("/unsubscribe", ContactController.unsubscribe)
  .get("/verify/:token", verify)
  .get("/dashboard", ResourceController.random, (req, res) => {
    res.render("dashboard/dashboardhome",  { locals: req.locals });
  })
  .get("/blog", (req, res) => {
    res.render("blog");
  })
  .get("/", CityController.get, ResourceController.random, (req, res) => {
    // console.log(req.locals)
    // extract message if this page was redirected to from another page
    if (req.app.locals && req.app.locals.message) req.locals.infoMessage = req.app.locals.message
    res.render("home", { locals: req.locals });
  })
  .get("/listings", (req, res) => {
    res.render("listings");
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

  // Authenticated Endpoints
  .use((req, res, next) => {
    if (!(req.isAuthenticated() && req.user)) return res.redirect("/login");
    next();
  })

  .get("/profile", user, (req, res) => {
    res.render("profile", { locals: req.locals });
  })

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
