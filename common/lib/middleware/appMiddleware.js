const Express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const csrf = require('csurf')
const path = require('path')
const userAgent = require('express-useragent')
const config = require('../config')
const SessionUtil = require('../utils/session_util')
const helmet = require('helmet')

// const passport = require('passport')
const flash = require('connect-flash')

module.exports = (server, view) => {
    server.use(Express.static(path.resolve(config.STORAGE)))
    // server.use(Express.static(path.resolve(config.STORAGE, 'assets')))

    server.use(logger('dev'))
    server.use(Express.json())
    server.use(Express.urlencoded({ extended: true }))
    server.use(cors())
    server.use(helmet())

    server.use(flash())
    server.use(userAgent.express())
    server.use(cookieParser(config.SECRET))
    server.use(SessionUtil.newSession)
    server.use(csrf())

    // view engine setup
    server.set('views', view)
    server.set('view engine', 'ejs')
    // server.use('/upload', Express.static(path.join(__dirname, '../upload')))
    // server.use(Express.static(path.join(__dirname, '../../public')))

    // server.use(Express.static(path.join(__dirname, '../../assets')))
    // server.use('/admin', expres s.static(path.join(__dirname, '../../assets')))
    // server.use('/company', Express.static(path.join(__dirname, '../../assets')))
}