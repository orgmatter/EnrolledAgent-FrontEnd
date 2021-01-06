
const router = require('express').Router()
const {FileManager} = require('common')
const ClaimController = require('../controllers/claim')

router
    .get('/claim/', ClaimController.getAll)
    .get('/claim/:id', ClaimController.get)
    .post('/approve-claim/:id', FileManager.none, ClaimController.approveClaim)
    .post('/reject-claim/:id', FileManager.none, ClaimController.rejectClaim)

module.exports = router