
const router = require('express').Router()
const {FileManager} = require('common')
const AgentController = require('../controllers/agent')

router
    .get('/', AgentController.getAll)
    .get('/:id', AgentController.get)
    .put('/:id', FileManager.upload, AgentController.update)
    .put('/', FileManager.upload, AgentController.create)
    .post('/upload', FileManager.csv, AgentController.upload)

module.exports = router