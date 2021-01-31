const router = require("express").Router();
const { FileManager , AwsService, Storages} = require("common");
const ArticleController = require('../controllers/article')

router
    .get("/", ArticleController.getAll)
    .get("/:id", ArticleController.get)
    .post("/status", FileManager.none,  ArticleController.status)
    .post("/", AwsService.image(Storages.ARTICLE).single('avatar'), ArticleController.create)
    .put("/:id", AwsService.image(Storages.ARTICLE).single('avatar'), ArticleController.update)
    .delete("/:id", ArticleController.delete)

module.exports = router
