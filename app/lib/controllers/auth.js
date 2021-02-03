const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  Storages,
  Logger,
  // FileManager,
  Validator,
  Helper,
  JwtManager,
  AwsService,
  Constants,
  PageAnalyticsService,
  MailService,
  EmailTemplates,
  Models: { User, LogModel, Config, EmailList, VerificationToken, ResetToken },
} = require("common")
const passport = require("passport");
const uid = require("uid");
const { locals } = require("..");

const APP_URL = process.env.APP_URL

const log = new Logger("App:auth")
 

/**
   * make sure protected content is not overriden
   * @param  {string} body
   */
const sanitizeBody = (body) => {
  delete body.updatedAt
  delete body.createdAt
  delete body._id
  delete body.salt
  delete body.hash
  delete body.email
  delete body.isActive
  delete body.isEmailVerified
  delete body.accountType
}

class AuthController {

  /**
  * get question categorirs
  * @param  {Express.Request} req
  * @param  {Express.Response} res
  * @param  {Function} next
  */
  async config(req, res, next) {
    req.locals.config = {}
    const data = await Config.find({}, { _id: 0, __v: 0, slug: 0, createdAt: 0, updatedAt: 0 })
      .exec()
    if (data && data.length > 0)
      req.locals.config = data
    // log.info(req.locals)
    next()

  }


  /**
   * Register a new user
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  register = async (req, res, next) => {
    const { body } = req

    log.info("register ", body)
    if (!("email" in body) || !("password" in body)) {
      res.status(422)
      return next(
        new Exception(
          ErrorMessage.REQUIRED_EMAIL_PASSWORD,
          ErrorCodes.REQUIRED_EMAIL_PASSWORD
        )
      )
    }
    if (!("firstName" in body) || !("lastName" in body)) {
      res.status(422)
      return next(
        new Exception(
          "First name and last name is required",
          ErrorCodes.REQUIRED_EMAIL_PASSWORD
        )
      )
    }

    const {
      email,
      password,
      firstName,
      lastName,
      subscribeToNewsletter
    } = body


    if (await User.exists({ email: String(email).toLowerCase() })) {
      res.status(422)
      return next(
        new Exception(
          // eslint-disable-next-line new-cap
          ErrorMessage.EMAIL_IN_USE(email),
          ErrorCodes.EMAIL_IN_USE
        )
      )
    }



    let user = new User({
      email: String(email).toLowerCase(),
      firstName,
      lastName,
    })
    user.setPassword(password)

    await user.save()

    if (subscribeToNewsletter)
      EmailList.findOneAndUpdate({ email }, { email }, { upsert: true })

    this.sendVerification(email, req, res, next)
  }


  /**
 * Verify a users mail
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {Function} next
 */
  sendVerification = async (email, req, res, next) => {
    const user = await User.findOne({ email }).exec()

    let verification = await VerificationToken.findOne({ user: user._id, token: { $exists: true } }).exec()

    if (!verification || !verification.token)
      verification = await VerificationToken.create({ user: user._id, token: uid(30) })
    const link = `${APP_URL}/verify/${verification.token}`

    const message = `A mail has been sent to ${email}, please click the link to verify your account`

    req.session.message = message
    res.json({
      data: {
        message
      },
    })

    // send an email for user to verify account

    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.VERIFY_EMAIL,
        reciever: email,
        subject: "Verify Your Email",
        locals: { name: `${user.firstName} ${user.lastName}`, link },
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )

  }

  /**
 * Verify a users mail
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {Function} next
 */
  sendPasswordReset = async (req, res, next) => {
    const { body: { email } } = req
    const message = `A reset link has been sent to your mail, please note that this link expires in 10 minutes`
    let link

    const user = await User.findOne({ email }).exec()
    if (user && user._id) {
      await ResetToken.deleteMany({ user: user._id }).exec()
      const reset = await ResetToken.create({ user: user._id, token: uid(30) })

      if (reset || reset.token)
        link = `${APP_URL}/reset/${reset.token}`
    }
    req.session.message = message
    res.json({
      data: {
        message
      },
    })
    // send an email for user to verify account
    if (user && user._id && link) {
      new MailService().sendMail(
        {
          // secret: config.PUB_SUB_SECRET,
          template: EmailTemplates.RESET_EMAIL,
          reciever: email,
          subject: "Recover your account",
          locals: { name: `${user.firstName} ${user.lastName}`, link },
        },
        (res) => {
          if (res == null) return
          log.error("Error sending mail", res)
        }
      )
    }

  }

  /**
 * Validate email link to reset password
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {Function} next
 */
  passwordResetLink = async (req, res, next) => {
    const { params: { token } } = req

    let reset = await ResetToken.findOne({ token }).exec()
    if (!(reset && reset.token)) {
      req.session.error = 'Your reset link is either epired or invalid'
      return res.redirect('/')
    }
    reset.deleteOne().then(() => { })

    const tokn = uid(32)
    ResetToken.create({ user: reset.user, token: tokn })
      .then(() => { })

    req.session.resetToken = tokn

    res.redirect('/reset-password');

    PageAnalyticsService.inc('/verify-email')
  }

  /**
  * Validate email link to reset password
  * @param  {Express.Request} req
  * @param  {Express.Response} res
  * @param  {Function} next
  */
  passwordResetPage = async (req, res, next) => {
    const { params: { token } } = req

    if (req.session.resetToken && await ResetToken.exists({ token: req.session.resetToken }))
      return res.render('resetPassword', { locals: req.locals });

    res.redirect('/')
    PageAnalyticsService.inc('/reset-password')

  }


  /**
   * Reset password if a reset code exists in session
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  resetPassword = async (req, res, next) => {
    const { body } = req;
    const token = req.session.resetToken
    let reset = await ResetToken.findOne({ token }).exec()
    let user
    if (reset && reset.user)
      user = await User.findById(reset.user)

    // log.info(reset, user, token)
    if (!(reset && reset.token && user && user._id)) {
      // res.locals.infoMessage = 'Your reset link is either expired or invalid'
      return next(
        new Exception(
          'Your reset session is either expired or invalid, please try again',
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    }


    if (!body.password) {
      res.statusCode = 422;
      return next(
        new Exception(
          ErrorMessage.REQUIRED_PASSWORD,
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    }
    user.setPassword(body.password);
    user.passwordChangedAt = new Date()
    await user.save();

    reset.deleteOne().then(() => { })
    req.session.resetToken = null
    req.session.message = "Password Changed succesfully"

    res.json({ data: { message: "Password Changed succesfully" } });
  }


  /**
* Verify a users mail
* @param  {Express.Request} req
* @param  {Express.Response} res
* @param  {Function} next
*/
  resendVerification = async (req, res, next) => {
    const { email } = req.body
    this.sendVerification(email, req, res, next)
  }


  /**
   * Verify a users mail
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  verify = async (req, res) => {
    const { token } = req.params
    const verification = await VerificationToken.findOne({ token })
      .populate('usr').exec()

    // log.info(verification)
    if (verification && verification.usr && verification.usr.email) {


      const { email, firstName, lastName } = verification.usr
      const usr = await User.findOneAndUpdate(
        { email },
        { isEmailVerified: true }
      )
      if (usr) {
        new MailService().sendMail(
          {
            template: EmailTemplates.WELCOME,
            reciever: email,
            subject: "Welcome ",
            locals: { name: `${firstName} ${lastName}` },
          },
          (res) => {
            if (res == null) return
            log.error("Error sending mail", res)
          }
        )
      }
      req.session.message = "Your email has been verified succesfully"
      // res.locals = { ...req.locals, message: "Your email has been verified succesfully" }
      res.redirect("/")
    } else
      req.session.error = "invalid link, Could not Verify your mail"
    res.redirect("/")
  }

  /**
   * Change password
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  changePassword = async function (req, res, next) {
    if (req.isAuthenticated() && Validator.isMongoId(req.user.id)) {
      const {
        user: { email, id },
        body: { password, oldPassword },
      } = req
      const user = await User.findById(id).exec()
      // log.info(user, company, email)
      if (!(user != null && user.email != null)) {
        res.statusCode = 422
        return next(
          new Exception(
            ErrorMessage.ACCOUNT_NOT_FOUND,
            ErrorCodes.ACCOUNT_NOT_FOUND
          )
        )
      }
      if (!user.validatePassword(oldPassword)) {
        res.statusCode = 422
        return next(
          new Exception(
            "Your password is not correct, please use a valid password",
            ErrorCodes.INCORRECT_PASSWORD
          )
        )
      }
      user.setPassword(password)
      user.isEmailVerified = true
      user.passwordChangedAt = new Date()
      await user.save()

      const message = "Password Changed succesfully"
      req.session.message = message

      res.json({ data: { message } })
    } else {
      next(
        new Exception(
          // eslint-disable-next-line new-cap
          ErrorMessage.NO_PRIVILEGE,
          ErrorCodes.NO_PRIVILEGE
        )
      )
    }
  }


  /**
   * Get user profile
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  user = async function (req, res, next) {
    if (req.user && req.user.id) {
      const { id } = req.user
      User.findById(id, { salt: 0, hash: 0 }).then((doc) => {
        req.locals.user = doc
        next()
      })
    } else next()
  }

  /**
   * update a user record, if a file was uploaded,
   * it saves the file to storge
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  update = async (req, res, next) => {
    const {
      user: { id },
      body,
    } = req

    if (req.isAuthenticated() && Validator.isMongoId(String(id))) {
      sanitizeBody(body)

      User.findByIdAndUpdate(id, body, { new: true })
        .then(async (user) => {
          if (req.file) {
            const imageUrl = req.file.location
            if (user.imageUrl && imageUrl) AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(user.imageUrl))
          
            
            user.imageUrl = imageUrl
            user.save()
            req.session.passport.user = Helper.userToSession(user)
          }
          res.json({ data: { message: "Profile updated succesfully" } })
        })
        .catch((err) => {
          next(err)
        })
    } else {
      next(
        new Exception(
          // eslint-disable-next-line new-cap
          ErrorMessage.NO_PRIVILEGE,
          ErrorCodes.NO_PRIVILEGE
        )
      )
    }
  }


  /**
   * Login to user account
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  login = async function (req, res, next) {
    passport.authenticate(Constants.DOMAIN.user, (err, user, info) => {
      log.info(err, user, info)
      if (err) {
        log.info(err)
        res.status(400)
        return next(err)
      }
      if (!user) {
        return res.json({ data: { message: "Unknown error occured" } })
      }
      req.logIn(user, function (err) {
        if (err) {
          res.status(400)
          return next(err)
        }
        const message = `Welcome back ${user.firstName}`
        req.session.message = message
        return res.json({ data: { message } })
      })
    })(req, res, next)
  }


  /**
   * handle Social login
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   * @param  {} err
   * @param  {} user
   * @param  {} info
   */
  handleSocial = function (req, res, next, err, user, info) {
    // log.info(err, user, next)
    let message
    if (err) {
      if (err instanceof Exception)
        message = err.message
      else {
        message = err.message || 'Authentication failed'
      }
      if (err.code == 'user_cancelled_login') message = 'Authentication canceled'
      log.info(user, info, err)
      res.status(400)
      req.session.error = message
      res.locals = { ...locals, message }
      if (String(req.url).includes('register'))
        return res.redirect('/register');
      return res.redirect('/login');
      // return res.render('login', { message })
    }
    req.logIn(user, function (err) {
      // log.info(err)
      if (err) {
        const message = `Login Failed`
        req.session.message = message
      } else {
        const message = `Welcome back ${user.firstName}`
        req.session.message = message
      }

      return res.redirect('/');
    });
    // Successful authentication, redirect home.
    // res.redirect('/');
  }

}




module.exports = new AuthController()
