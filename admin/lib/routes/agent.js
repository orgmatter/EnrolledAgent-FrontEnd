
const router = require('express').Router()
const {FileManager, AwsService,Storages} = require('common')
const AgentController = require('../controllers/agent')

router
    .get('/', AgentController.getAll)
    .get('/:id', AgentController.get)
    .put('/:id', AwsService.image(Storages.AGENT_PROFILE).single('avatar'), AgentController.update)
    .post('/',  AwsService.image(Storages.AGENT_PROFILE).single('avatar'), AgentController.create)
    .post('/upload', FileManager.csv, AgentController.upload)
    // .post('/', FileManager.csv, AgentController.create)
   

module.exports = router