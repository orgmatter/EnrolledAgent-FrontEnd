const router = require("express").Router();
const {FileManager} = require('common')

const FaqController = require('../controllers/faq')

router
    .get('/',  FaqController.getAll)
    .get('/:id', FaqController.get)
    .post("/", FileManager.none, FaqController.create)
    .put("/:id", FileManager.none, FaqController.update)
    .delete("/:id", FaqController.delete)

module.exports = router
