const router = require("express").Router();
const { Logger, Middleware, FileManager } = require("common");
const AuthController = require("../../controllers/auth");
const ContactController = require("../../controllers/contact");
const ReviewController = require("../../controllers/review");
const AgentController = require("../../controllers/agent");

router
  .post("/register", AuthController.register)
  .post("/changepass", AuthController.changePassword)
  .post("/subscribe", ContactController.subscribe)
  .post("/contact", ContactController.create)
  .post("/login", AuthController.login)
  .post("/review", ReviewController.createReview)
  .post("/claim-listing/:id", AgentController.claim)
  .put("/update-profile", FileManager.upload, AuthController.update)
  .put("/update-agent", FileManager.upload, AgentController.update)

  .use(Middleware.Four04Handler)
  .use(Middleware.ErrorHandler);

module.exports = router
