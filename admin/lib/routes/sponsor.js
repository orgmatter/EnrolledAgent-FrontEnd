const router = require('express').Router()
const {AwsService, Storages} = require('common')
const Controller = require('../controllers/sponsor')

router
    .get('/',   Controller.getAll)
    .get('/:id', Controller.get)
    .put('/:id', AwsService.image(Storages.SPONSOR).single('avatar'), Controller.update)
    .post('/',  AwsService.image(Storages.SPONSOR).single('avatar'), Controller.create) 
    .delete('/:id',   Controller.delete)

module.exports = router