const router = require("express").Router();
const { FileManager } = require("common");
const ResourceController = require("../controllers/resource");

const SponsorController = require('../controllers/sponsor') 

router
    .get("/resource/:id", ResourceController.get)
    .get("/resource", FileManager.upload, ResourceController.getAll)
    .post("/resource", FileManager.upload, ResourceController.create)
    .put("/resource/:id", FileManager.upload, ResourceController.update)
    .delete("/resource/:id", ResourceController.delete)

    .put('/sponsor/:id', FileManager.upload, SponsorController.update)
    .post('/sponsor', FileManager.upload, SponsorController.create)
    .delete('/sponsor/:id', SponsorController.delete)

module.exports = router
