const router = require("express").Router();
const passport = require("passport");
const { Validator, Logger, Constants } = require("common");
const { app } = require("common/lib/middleware");
// const auth = require("../controllers/auth");
const { handleSocial, verify, subscribe, unsubscribe } = require("../controllers/auth");

const Log = new Logger("App:Router");

router.use("/api", require("./api"));

router.use((req, res, next) => {
  req.locals = {};
  req.locals.pageTitle = "Home";
  if (req.isAuthenticated() && req.user && req.user.accountType == Constants.ACCOUNT_TYPE.user)
    req.locals.isAuthenticated = true;
  next();
});

router
  .use((req, res, next) => {
    console.log(req.isAuthenticated(), req.user)
    //   console.log(req.body, req.params)
    next()
  })


  .get('/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
      handleSocial(req, res, next, err, user, info)
    })(req, res, next)
  })
  .get('/google/callback', function (req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'], }, function (err, user, info) {
      handleSocial(req, res, next, err, user, info)
    })(req, res, next)
  })
  .get('/linkedin/callback', function (req, res, next) {
    passport.authenticate('linkedin', function (err, user, info) {
      handleSocial(req, res, next, err, user, info)
    })(req, res, next)
  })
  // .get('/linkedin/callback', passport.authenticate('linkedin'), handleSocial)
  // .get('/google/callback', passport.authenticate('google', { scope: ['profile', 'email'], }), handleSocial)
  .get("/unsubscribe", unsubscribe)
  .get("/subscribe", subscribe)
  .get("/verify/:token", verify)
  .get("/signup", (req, res) => {
    res.render("signup");
  })
  .get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  })
  .get("/login", (req, res) => {
    if (req.isAuthenticated() && req.user)
      return res.redirect("/");
    res.render("login");
  })
  .get("/register", (req, res) => {
    if (req.isAuthenticated() && req.user)
      return res.redirect("/");
    res.render("signup");
  })

  // Authenticated Endpoints
  .use((req, res, next) => {
    if (!(req.isAuthenticated() && req.user))
      return res.redirect("/login");
    next();
  })

  .get("/", (req, res) => {
    res.render("home", { locals: req.locals });
  })
  .get("/claim", (req, res) => {
    res.render("listings");
  })

// catch 404
router.use((req, res) => {
  res.statusCode = 404;
  // console.log(req.url.split("/").pop());
  res.render(req.path.split("/").pop(), { locals: req.locals }, (err, dat) => {
    if (err) res.render("page_404");
    else res.send(dat);
  });
});

// error handler
router.use((err, req, res, next) => {
  Log.info(err);
  console.log(err);
  Log.info(req.headers);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};
  res.status(err.status || 500);
  res.render("page_500");
});



module.exports = router;
