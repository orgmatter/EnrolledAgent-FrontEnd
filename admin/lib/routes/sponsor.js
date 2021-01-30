const router = require('express').Router()
const {FileManager} = require('common')
const Controller = require('../controllers/sponsor')

router
    .get('/',   Controller.getAll)
    .get('/:id', Controller.get)
    .put('/:id',   FileManager.upload, Controller.update)
    .post('/',  FileManager.upload, Controller.create)
    .delete('/:id',   Controller.delete)

module.exports = router