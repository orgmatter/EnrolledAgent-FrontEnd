const router = require("express").Router();
const { Logger, Middleware, FileManager } = require("common");

const AuthController = require("../controllers/auth");
const ContactController = require("../controllers/contact");
const ReviewController = require("../controllers/review");
const AgentController = require("../controllers/agent");
const ArticleController = require("../controllers/article");
const QuestionController = require("../controllers/question");
const LicenceController = require("../controllers/licence");

router
  .post("/register", AuthController.register)
  .post("/verify-mail/:token", AuthController.verify)
  .post("/resend-verification", AuthController.resendVerification)
  .post("/changepass", AuthController.changePassword)
  .post("/send-reset", AuthController.sendPasswordReset)
  .post("/reset-password", AuthController.resetPassword)
  .post("/subscribe", ContactController.subscribe)
  .post("/contact", ContactController.create)
  .post("/contact-agent", ContactController.sendAgentMessage)
  .post("/login", AuthController.login)
  .post("/review", ReviewController.createReview)
  .post("/claim-listing/:id", AgentController.claim)
  .post("/listing-request", FileManager.pdf, AgentController.createListing)
  .post("/contact-preference", FileManager.pdf, AgentController.contactPreference)
  .put("/update-profile", FileManager.upload, AuthController.update)
  .put("/update-agent", FileManager.upload, AgentController.update)
  .post("/upgrade-account", FileManager.none, AgentController.premium)
  .post("/licence", FileManager.none, LicenceController.create)
  .post("/ask", FileManager.none, QuestionController.create)
  .post("/offshore", FileManager.none, ContactController.offshore)
  .post("/answer", FileManager.none, QuestionController.answer)
  .post("/article", FileManager.upload, ArticleController.create)
  .post("/article/comment/:id", FileManager.none, ArticleController.comment)
  .put("/article/:id", FileManager.upload, ArticleController.update)
  .delete("/article/:id", FileManager.upload, ArticleController.delete)

  .use(Middleware.Four04Handler)
  .use(Middleware.ErrorHandler);

module.exports = router
