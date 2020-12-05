const router = require("express").Router();
const { Logger, Middleware, FileManager } = require("common");
const { register, changePassword, login, update, subscribe } = require("../../controllers/auth");
const ContactController = require("../../controllers/contact");

router

  .post("/register", register)
  .post("/changepass", changePassword)
  .post("/subscribe", ContactController.subscribe)
  .post("/contact", ContactController.create)
  .post("/login", login)
  .put("/update-profile", FileManager.upload, update);

router.use(Middleware.Four04Handler);
router.use(Middleware.ErrorHandler);

module.exports = router;
