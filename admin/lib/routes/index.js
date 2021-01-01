const router = require("express").Router();
const seeder = require("../../seeder/seed") 

const {
   Middleware
} = require("common");


// seeder()

router
  .use(require('./auth'))
  .use(require('./resource'))
  .use('/sponsor', require('./sponsor'))
  .use('/category', require('./category'))
  .use('/article', require('./article'))
  


  .use(Middleware.ExtractToken.token.unless([]))
  .use(Middleware.ExtractToken.decodeData)

  // send all remaining request to the default router
  .use(Middleware.Four04Handler)
  // handle all unhandled error
  .use(Middleware.ErrorHandler)




module.exports = router;
