const router = require("express").Router();
const { Middleware, FileManager } = require("common");
const ResourceController = require("../controllers/resource");

const SponsorController = require('../controllers/sponsor')
const ArticleController = require('../controllers/article')
const BaseController = require('../controllers/baseController')
router

    .post("/resource", FileManager.upload, ResourceController.create)
    .put("/resource/:id", FileManager.upload, ResourceController.update)
    .delete("/resource", ResourceController.delete)

    .post("/article", FileManager.upload, ArticleController.create)
    .put("/article/:id", FileManager.upload, ArticleController.update)
    .delete("/article", ArticleController.delete)

    .put('/sponsor/:id', BaseController.authHandler, FileManager.upload, SponsorController.update)
    .post('/sponsor', BaseController.authHandler, FileManager.upload, SponsorController.create)
    .delete('/sponsor/:id', BaseController.authHandler, SponsorController.delete)

    .use(Middleware.Four04Handler)
    .use(Middleware.ErrorHandler);

module.exports = router;
