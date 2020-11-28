const config = require('../../config')
const Constants = require('../../utils/constants')
const CustomStrategy = require('passport-custom').Strategy
const AdminUser = require('../../models/admin_user')
const User = require('../../models/user')
const {authenticateUser} = require('./utils')

module.exports = class LocalLoginStrategy {
    /**
     * @param  {import('passport').PassportStatic} passport
     */
    static register(passport) {
    //     /**
    //   * Authenticate auser as a customer
    //   */

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
                        // Log.info(!(user && user.email))
                        authenticateUser(user, password, done)
                    })
                })
            )

        // /**
        //  * Authenticate auser as an admin
        //  */
        // if (domain == Constants.DOMAIN.admin)
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
                        // Log.info(!(user && user.email))

                        authenticateUser(user, password, done)
                    })
                })
            )
    }

    
}
