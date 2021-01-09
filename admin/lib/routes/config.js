
const router = require('express').Router()
const {FileManager} = require('common')
const ConfigController = require('../controllers/config')

router
    .get('/', ConfigController.get)
    .post('/', FileManager.none, ConfigController.update)

module.exports = router