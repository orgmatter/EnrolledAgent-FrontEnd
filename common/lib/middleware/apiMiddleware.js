const Express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
// const FileManager = require("../service/fileManager");
const config = require('../config')

/**
 * @param  {Express.Application} server
 */
module.exports = (server) => {
  server.use(logger('dev'))
  // server.use(FileManager.none);
  server.use(Express.json())
  server.use(Express.urlencoded({extended: true}))
 
  server.use(Express.static(path.resolve(config.STORAGE)))
  server.use(cors())
}
