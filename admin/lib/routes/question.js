const router = require("express").Router();
const { FileManager } = require("common");
const QuestionController = require('../controllers/question')

router
    .get("/", QuestionController.getAll)
    .get("/:id", QuestionController.get)
    .post("/:id", FileManager.none, QuestionController.setAnswer)
    .put("/:id", FileManager.none, QuestionController.update)
    .delete("/:id", QuestionController.delete)

module.exports = router
