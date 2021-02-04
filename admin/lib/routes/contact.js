const router = require("express").Router();
const Controller = require('../controllers/contact')

router
    .get("/partner", Controller.partnerReq)
    .get("/contact", Controller.getAll)
    .get("/contact/:id", Controller.get)

module.exports = router
