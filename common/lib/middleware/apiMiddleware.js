const Express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const config = require('../config')
/**
 * @param  {Express.Application} server
 */
module.exports = (server) => {
  server.use(logger('dev'))
  server.use(Express.json())
  server.use(Express.urlencoded({extended: false}))
  server.use(Express.static(path.resolve(config.STORAGE)))
  server.use(cors())
}
