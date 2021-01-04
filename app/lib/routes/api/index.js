const router = require("express").Router();
const { Logger, Middleware, FileManager } = require("common");
const { register, changePassword, login, update, subscribe } = require("../../controllers/auth");
const ContactController = require("../../controllers/contact");
const ReviewController = require("../../controllers/review");

router

  .post("/register", register)
  .post("/changepass", changePassword)
  .post("/subscribe", ContactController.subscribe)
  .post("/contact", ContactController.create)
  .post("/login", login)
  .post("/review", ReviewController.createReview)
  .put("/update-profile", FileManager.upload, update);

router.use(Middleware.Four04Handler);
router.use(Middleware.ErrorHandler);

module.exports = router;
