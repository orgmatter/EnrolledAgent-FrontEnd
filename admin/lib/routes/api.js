const router = require("express").Router();
const { Middleware } = require("common");


router



router.use(Middleware.Four04Handler)
router.use(Middleware.ErrorHandler);

module.exports = router;
