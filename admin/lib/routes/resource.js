const router = require("express").Router();
const {  AwsService, Storages } = require("common");
const Controller = require("../controllers/resource");


router
    .get("/:id", Controller.get)
    .put('/:id', AwsService.image(Storages.RESOURCE).single('avatar'), Controller.update)
    .post('/',  AwsService.image(Storages.RESOURCE).single('avatar'), Controller.create) 
    .get("/",   Controller.getAll) 
    .delete("/:id", Controller.delete) 

module.exports = router
