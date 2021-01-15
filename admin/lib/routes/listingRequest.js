const router = require("express").Router();
const { FileManager } = require("common");
const ListingRequestController = require('../controllers/listingRequest')

router
    .get("/", ListingRequestController.getAll)
    .get("/:id", ListingRequestController.get)
    .post("/approve/:id", FileManager.none,  ListingRequestController.approve)
    .post("/reject/:id", FileManager.none,  ListingRequestController.reject)
    .post("/:id", FileManager.none, ListingRequestController.update)
    .delete("/:id", ListingRequestController.delete)

module.exports = router
