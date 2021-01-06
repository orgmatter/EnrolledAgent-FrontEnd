
const router = require('express').Router()
const LogController = require('../controllers/log')

router
    .get('/', LogController.getAll)
    .get('/:id', LogController.get)
    .delete('/:id',   LogController.delete)
  

module.exports = router