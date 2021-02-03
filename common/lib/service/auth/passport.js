


const Helper = require('../../utils/helper')

const Logger = require('../../utils/logger')
const FacebookLoginStrategy = require('./facebookLoginStrategy')
const GoogleLoginStrategy = require('./googleLoginStrategy')
const LinkedinLoginStrategy = require('./linkedinLoginstrategy')
const LocalLoginStrategy = require('./localLoginStrategy')
const Log = new Logger('Common:Passport')

/**
 * @param  {Express} server
 */
module.exports = (server, passport) => {
    // console.log('passport', passport)
    Log.info('initializing passport' + passport)
    // console.log('deserializing user')
    server.use(passport.initialize())
    server.use(passport.session())

    passport.serializeUser((user, done) => {
        // console.log('serializing user')
        if (Log.isDebugMode) Log.info('serializing user', user)
        // console.log('serializing user', user)
        done(null, Helper.userToSession(user))
    })

    passport.deserializeUser((user, done) => {
        if (Log.isDebugMode) Log.info('deserializing user', user)
        // console.log('deserializing user', user)
        done(null, user)
    })

    FacebookLoginStrategy.register(passport)
    GoogleLoginStrategy.register(passport)
    LinkedinLoginStrategy.register(passport)
    LocalLoginStrategy.register(passport)
}