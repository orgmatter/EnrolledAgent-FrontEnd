const router = require("express").Router();
const { FileManager } = require("common");
const ArticleController = require('../controllers/article')

router
    .get("/", ArticleController.getAll)
    .get("/:id", ArticleController.get)
    .post("/status",   ArticleController.status)
    .post("/", FileManager.upload, ArticleController.create)
    .put("/:id", FileManager.upload, ArticleController.update)
    .delete("/:id", ArticleController.delete)

module.exports = router
