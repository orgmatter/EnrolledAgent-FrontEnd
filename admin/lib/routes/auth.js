
const router = require('express').Router()
const {FileManager} = require('common')
const AuthController = require('../controllers/auth')

router
    .post('/login', FileManager.none, AuthController.login)

module.exports = router