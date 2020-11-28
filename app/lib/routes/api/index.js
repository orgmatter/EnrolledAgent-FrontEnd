const router = require("express").Router();
const {
  Logger,
  Middleware,
  FileManager,
} = require("common");
const {register, changePassword, login, update} = require("../../controllers/auth");

router
  
  .post("/register", register)
  .post("/changepass", changePassword)
  .post("/login", login)
  .put("/update-profile", FileManager.upload, update);

router.use(Middleware.Four04Handler)
router.use(Middleware.ErrorHandler);

module.exports = router;
