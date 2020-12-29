const router = require("express").Router();
const user = require("../controllers/users");
const seeder = require("../seed")
const SponsorController = require('../controllers/sponsor')
const ArticleController = require('../controllers/article')

const {
  Exception,
  Constants,
  Logger, Middleware
} = require("common");

const Log = new Logger("Admin:Router");

seeder()

router


  .use( require('./auth'))


  .use(Middleware.ExtractToken.token.unless([]))
  .use(Middleware.ExtractToken.decodeData)

  // send all remaining request to the default router
  .use(Middleware.Four04Handler)
  // handle all unhandled error
  .use(Middleware.ErrorHandler)




module.exports = router;
