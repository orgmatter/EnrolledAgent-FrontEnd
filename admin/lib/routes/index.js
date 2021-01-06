const router = require("express").Router();

const {
   Middleware
} = require("common");



router
  .use(require('./auth'))
  .use(Middleware.ExtractToken.token.unless([]))
  .use(Middleware.ExtractToken.decodeData)
  .use(require('./resource'))
  .use('/sponsor', require('./sponsor'))
  .use('/category', require('./category'))
  .use('/article', require('./article'))
  .use('/question', require('./question'))
  




  // send all remaining request to the default router
  .use(Middleware.Four04Handler)
  // handle all unhandled error
  .use(Middleware.ErrorHandler)




module.exports = router;
