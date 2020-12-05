const router = require('express').Router()
const {FileManager} = require('common')
const Controller = require('../controllers/sponsor')
const BaseController = require('../controllers/baseController')

router
    .get('/', BaseController.authHandler, Controller.getAll)
    .get('/:id',BaseController.authHandler, Controller.get)
    .put('/:id', BaseController.authHandler, FileManager.upload, Controller.update)
    .post('/', BaseController.authHandler, FileManager.upload, Controller.create)
    .delete('/:id', BaseController.authHandler, Controller.delete)

module.exports = router