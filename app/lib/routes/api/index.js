const router = require("express").Router();
const {
  Logger,
  Middleware,
  FileManager,
} = require("common");
const auth = require("../../controllers/auth");

router
  
  .post("/register", auth.register)
  .get("/verify", auth.verify)
  .post("/changepass", auth.changePassword)
  .post("/login", auth.login)
  .put("/update-profile", FileManager.upload, auth.update);

router.use(Middleware.Four04Handler)
router.use(Middleware.ErrorHandler);

module.exports = router;
