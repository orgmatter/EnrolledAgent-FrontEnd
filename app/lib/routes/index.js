const router = require("express").Router();
const { Validator, Logger, Constants } = require("common");
const auth = require("../controllers/auth");

const Log = new Logger("App:Router");

router.use("/api", require("./api"));

router.use((req, res, next) => {
  req.locals = {};
  req.locals.pageTitle = "Home";
  if (req.isAuthenticated() && req.user && req.user.accountType == Constants.accountType.user)
    req.locals.isAuthenticated = true;
  next();
});

router
  .get("/", (req, res) => {
    res.render("home", { locals: req.locals });
  })
  .get("/claim", (req, res) => {
    res.render("listings");
  })
  .get("/career-center", (req, res) => {
    res.render("careerCenter");
  })
  .get("/dashboard", (req, res) => {
    res.render("dashboard/dashboardhome");
  })
  .get("/unsubscribe", auth.unsubscribe)
  .get("/subscribe", auth.subscribe)
  .get("/verify/:token", auth.verify)
  .get("/signup", (req, res) => {
    res.render("signup");
  })
  .get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  })
  .use((req, res, next) => {
    if (!(req.isAuthenticated() && req.user && req.user.accountType == "customer"))
      return res.render("login");
    next();
  });

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
