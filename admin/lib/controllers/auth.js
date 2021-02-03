const {
    Exception,
    ErrorCodes,
    ErrorMessage,
    LogAction,
    LogCategory,
    Validator,
    Helper,
    Constants,
    JwtManager,
    Models: { AdminUser, Log },
    Logger,
} = require("common")

const log = new Logger('auth')
const jwt = new JwtManager(process.env.SECRET)

class AuthController {
    /**
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {Function} next
    */
    async login(req, res, next) {
        const { email, password } = req.body

        log.info(email, password)
        // console.log(req.body)

        if (!email || !password) {
            res.status(422)
            return next(
                new Exception(
                    'email and password is required',
                    ErrorCodes.REQUIRED
                )
            )
        }

        if (!Validator.email(email)) {
            res.status(422)
            return next(
                new Exception(
                    'Please use a valid email',
                    ErrorCodes.REQUIRED
                )
            )
        }

        AdminUser.findOne({ email: email })
        .populate('role')
            .then((user) => {
               
                if (!(user != null && user.email != null)) {
                    return next(
                        new Exception(
                            ErrorMessage.ACCOUNT_NOT_FOUND,
                            ErrorCodes.ACCOUNT_NOT_FOUND
                        )
                    )
                }
                if (!user.validatePassword(password)) {
                    return next(
                        new Exception(
                            ErrorMessage.INCORRECT_PASSWORD,
                            ErrorCodes.INCORRECT_PASSWORD
                        )
                    )
                }

                if (!user.isEmailVerified) {
                    return next(
                        new Exception(
                            ErrorMessage.EMAIL_NOT_VERIFIED,
                            ErrorCodes.EMAIL_NOT_VERIFIED
                        )
                    )
                }

                if (!user.isActive) {
                    return next(
                        new Exception(
                            ErrorMessage.ACCOUNT_DEACTIVATED,
                            ErrorCodes.ACCOUNT_DEACTIVATED
                        )
                    )
                }
                user.lastLogin = new Date()
                user.save()
                log.info(!(user && user.email))

                const token = jwt.signToken(Helper.userToSession(user, Constants.ACCOUNT_TYPE.admin))
                user.token = token
                const data = Helper.formatUser(user)
                res.json({ data, token })
                // log that an account was created login was succesful

                Log.create({
                    category: LogCategory.ACCOUNT,
                    user: user.id,
                    ip: Helper.getIp(req),
                    action: LogAction.USER_LOGIN,
                    message: 'Login Success'
                }).then()

            })

    }

}

module.exports = new AuthController()