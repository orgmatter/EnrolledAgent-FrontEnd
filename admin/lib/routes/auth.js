
const router = require('express').Router()
const {FileManager} = require('common')
const AuthController = require('../controllers/auth')
const UserController = require('../controllers/user')

router
    .post('/login', FileManager.none, AuthController.login)
    .post('/send-reset',  UserController.forgotPassword)
    .get('/reset/:token',  UserController.passwordResetLink)
    .post('/reset-password',  UserController.resetPassword)

module.exports = router