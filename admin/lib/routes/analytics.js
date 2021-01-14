
const router = require('express').Router()
const AnalyticController = require('../controllers/analytics')

router
    .get('/', AnalyticController.get)
    .get('/resource', AnalyticController.resource)
    .get('/article', AnalyticController.article)
    .get('/question', AnalyticController.question)
   

module.exports = router