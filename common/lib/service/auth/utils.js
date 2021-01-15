const Helper = require('../../utils/helper')
const ErrorMessage = require('../../utils/errorMessage')
const ErrorCodes = require('../../utils/errorCodes')
const Exception = require('../../utils/exception')
const { User } = require('../../models')

/**
 * @param  {object} user
 * @param  {string} password
 */
exports.authenticateUser = function (user, password, done) {
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
    if (user.isActive != true) {
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
 * authenticate users with oAuth provider
 * @param  {object} user
 * @param  {string} provider
 */
exports.authenticateWithProvider = async function (user, provider, done) {
    // console.log(user, provider)
    const { email } = user
    if (!email) done({ message: 'Sorry cannot validate your profile, please try again' })
    var usr = await User.findOne({ email })
    if (!usr) usr = await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: true,
        imageUrl: user.imageUrl,
        providers: [provider],
    })


    else {
        if (usr.providers && !usr.providers.includes(provider))
            usr.providers.push(provider)

        if (!usr.imageUrl || user.imageUrl) usr.imageUrl = user.imageUrl
    }
    if (usr.isActive != true) {
        return done(
            new Exception(
                ErrorMessage.ACCOUNT_DEACTIVATED,
                ErrorCodes.ACCOUNT_DEACTIVATED
            )
        )
    }

    usr.lastLogin = new Date()
    usr.isEmailVerified = true
    await usr.save()


    done(null, Helper.userToSession(usr))
}
