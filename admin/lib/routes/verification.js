const router = require("express").Router();
const Controller = require('../controllers/verification')

router
    .get("/", Controller.getAll)
    .get("/:id", Controller.get)

module.exports = router
