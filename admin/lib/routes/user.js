
const router = require('express').Router()
const {FileManager} = require('common')
const UserController = require('../controllers/user')

router
    .get('/', UserController.getAll)
    .get('/profile', UserController.profile)
    .put('/', FileManager.upload, UserController.update)
    .post('/activate/:id',  UserController.activateAccount)
    .post('/deactivate/:id',  UserController.deactivateAccount)
    // .put('/', FileManager.upload, UserController.create)
   

module.exports = router