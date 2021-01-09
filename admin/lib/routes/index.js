const router = require("express").Router();

const {
   Middleware
} = require("common");



router
  .use(require('./auth'))
  .use(Middleware.ExtractToken.token.unless([]))
  .use(Middleware.ExtractToken.decodeData)
  .use(require('./resource'))
  .use(require('./claim'))
  .use('/sponsor', require('./sponsor'))
  .use('/log', require('./log'))
  .use('/category', require('./category'))
  .use('/article', require('./article'))
  .use('/agent', require('./agent'))
  .use('/user', require('./user'))
  .use('/question', require('./question'))
  .use('/config', require('./config'))
  




  // send all remaining request to the default router
  .use(Middleware.Four04Handler)
  // handle all unhandled error
  .use(Middleware.ErrorHandler)




module.exports = router;
