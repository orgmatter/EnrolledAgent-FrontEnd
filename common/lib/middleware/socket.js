const sharedsession = require("express-socket.io-session")
const SessionUtil = require('../utils/sessionUtil')
const cookieParser = require('cookie-parser')
const config = require('../config')

module.exports = (io) => {

    io.use(sharedsession(SessionUtil.newSession, cookieParser(config.SECRET)));
    io.use(function(socket, next) {
        // console.log(socket.handshake)
        if (socket.handshake.session &&
            (socket.handshake.session.passport) &&
            (socket.handshake.session.passport.user)) {
            const { user } = socket.handshake.session.passport
            socket.user = user
            socket.id = user.id
        }
        next()
    })

}