const router = require("express").Router();
const { Logger, Helper } = require("common");
const ResourceController = require("../controllers/resource");
const ArticleController = require("../controllers/article");
const AuthController = require("../controllers/auth");
const QuestionController = require("../controllers/question");
const dayjs = require("dayjs");

const Log = new Logger("App:Router");



router
  .use((req, res, next) => {
    if (req.csrfToken) res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
  })

  .use("/api", require("./api"))
  .use('/webhook', require("payment_module").Webhook)

  .use((req, _, next) => {
    req.locals = {
      query: req.query, ...req.locals,
      capitalizeFirstLetter: Helper.capitalizeFirstLetter
    };
    req.locals.dayjs = dayjs;
    req.locals.pageTitle = "Home";
    if (req.session.message) {
      req.locals.infoMessage = req.session.message;
      delete req.session.message
    }
    if (req.session.error) {
      req.locals.errorMessage = req.session.error;
      delete req.session.error
    }

    if (req.isAuthenticated() && req.user) req.locals.isAuthenticated = true;
    next();
  })

  /// store categories to locals
  .use(
    (req, res, next) => {
      Promise.allSettled([
        new Promise((resolve, reject) => {
          ArticleController.category(req, res, () => resolve())
        }),
        new Promise((resolve, reject) => {
          ResourceController.category(req, res, () => resolve())
        }),
        new Promise((resolve, reject) => {
          QuestionController.category(req, res, () => resolve())
        }),
        new Promise((resolve, reject) => {
          AuthController.config(req, res, () => resolve())
        })])
        .then(val => next())
      // next();
    })


  .use(require('./auth'))
 
  // .use(require('./open'))
  .use(Helper.checkRedirectCookie, require('./open'))
  .use('/dashboard', require('./dashboard'))
  

  // catch 404
  .use(require('./four04'))

  // error handler
  .use(require('./error'))

module.exports = router;
