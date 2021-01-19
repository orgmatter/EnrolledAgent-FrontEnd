
const router = require('express').Router()
const Controller = require('../controllers/page')

router
    .get('/today', Controller.today) 
    .get('/month', Controller.month) 
    .get('/year', Controller.year) 
    .get('/', Controller.getAll)
    .get('/:id', Controller.get) 
  

module.exports = router