const router = require("express").Router();
const { Logger, Middleware, FileManager } = require("common");
const { register, changePassword, login, update, subscribe } = require("../../controllers/auth");
const ContactController = require("../../controllers/contact");
const ReviewController = require("../../controllers/review");
const AgentController = require("../../controllers/agent");

router
  .post("/register", register)
  .post("/changepass", changePassword)
  .post("/subscribe", ContactController.subscribe)
  .post("/contact", ContactController.create)
  .post("/login", login)
  .post("/review", ReviewController.createReview)
  .post("/claim-listing/:id", AgentController.claim)
  .put("/update-profile", FileManager.upload, update)

  .use(Middleware.Four04Handler)
  .use(Middleware.ErrorHandler);

module.exports = router
