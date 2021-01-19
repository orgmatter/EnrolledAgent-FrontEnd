
const router = require('express').Router()
const {FileManager} = require('common')
const UserController = require('../controllers/user')

router
    .get('/user/', UserController.getAll)
    .get('/user/profile', UserController.profile)
    .put('/user/', FileManager.upload, UserController.update)
    .post('/user/activate/:id',  UserController.activateAccount)
    .post('/user/deactivate/:id',  UserController.deactivateAccount)
 
    // .put('/', FileManager.upload, UserController.create)
   

module.exports = router