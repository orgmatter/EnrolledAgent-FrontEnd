const ErrorMessage = require('../utils/errorMessage')
const ErrorCodes = require('../utils/errorCodes')
const Exception = require('../utils/exception')
const Constants = require('../utils/constants')
const CustomStrategy = require('passport-custom').Strategy

const Helper = require('../utils/helper')
const AdminUser = require('../models/admin_user')
const User = require('../models/user')
const Logger = require('../utils/logger')

const Log = new Logger('Common:Passport')

/**
 * @param  {object} user
 * @param  {string} password
 */
const authenticateUser = function(user, password, done) {
        // Log.info(!(user && user.email))
        if (!(user != null && user.email != null)) {
            return done(
                new Exception(
                    ErrorMessage.ACCOUNT_NOT_FOUND,
                    ErrorCodes.ACCOUNT_NOT_FOUND
                )
            )
        }
        if (!user.validatePassword(password)) {
            return done(
                new Exception(
                    ErrorMessage.INCORRECT_PASSWORD,
                    ErrorCodes.INCORRECT_PASSWORD
                )
            )
        }
        if (!user.isEmailVerified) {
            return done(
                new Exception(
                    ErrorMessage.EMAIL_NOT_VERIFIED,
                    ErrorCodes.EMAIL_NOT_VERIFIED
                )
            )
        }
        if (!user.isActive) {
            return done(
                new Exception(
                    ErrorMessage.ACCOUNT_DEACTIVATED,
                    ErrorCodes.ACCOUNT_DEACTIVATED
                )
            )
        }
        done(null, Helper.userToSession(user))
    }
    /**
     * @param  {Express} server
     */
module.exports = (server, passport, domain) => {
    Log.info('initializing passport')
    server.use(passport.initialize())
    server.use(passport.session())

    passport.serializeUser((user, done) => {
        if (Log.isDebugMode) Log.info('serializing user', user)

        done(null, Helper.userToSession(user))
    })

    passport.deserializeUser((user, done) => {
        if (Log.isDebugMode) Log.info('deserializing user', user)
        done(null, user)
    })

   

    /**
     * Authenticate auser as a customer
     */
    if (domain == Constants.DOMAIN.user)
        passport.use(
            Constants.DOMAIN.user,
            new CustomStrategy((req, done) => {
                const {
                    body: { email, password }
                } = req
                if (!email && !password) {
                    return done(
                        new Exception(
                            ErrorMessage.REQUIRED_EMAIL_PASSWORD,
                            ErrorCodes.REQUIRED_EMAIL_PASSWORD
                        )
                    )
                }
                User.findOne({
                    email: email
                        // domain: Constants.DOMAIN.customer
                }).then((user) => {
                    Log.info(!(user && user.email))
                    authenticateUser(user, password, done)
                })
            })
        )

    /**
     * Authenticate auser as an admin
     */
    if (domain == Constants.DOMAIN.admin)
        passport.use(
            Constants.DOMAIN.admin,
            new CustomStrategy((req, done) => {
                const {
                    body: { email, password }
                } = req
                if (!email && !password) {
                    return done(
                        new Exception(
                            ErrorMessage.REQUIRED_EMAIL_PASSWORD,
                            ErrorCodes.REQUIRED_EMAIL_PASSWORD
                        )
                    )
                }
                AdminUser.findOne({
                    email: email,
                }).then((user) => {
                    Log.info(!(user && user.email))
                   
                    authenticateUser(user, password, done)
                })
            })
        )
}