const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  Storages,
  Logger,
  FileManager,
  Validator,
  Helper,
  JwtManager,
  Constants,
  MailService,
  EmailTemplates,
  Models: { User, LogModel, EmailList },
} = require("common")
const passport = require("passport");
const { locals } = require("..");

const APP_URL = process.env.APP_URL

const log = new Logger("auth:register")

const jwt = new JwtManager(process.env.SECRET)

class AuthController {

  /**
   * make sure protected content is not overriden
   * @param  {string} body
   */
  sanitizeBody = function (body) {
    delete body.updatedAt
    delete body.createdAt
    delete body._id
    delete body.salt
    delete body.hash
    delete body.isActive
    delete body.isEmailVerified
    delete body.accountType
  }


  /**
   * Register a new user
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  register = async function (req, res, next) {
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
      email,
      firstName,
      lastName,
    })
    user.setPassword(password)
    await user.save()

    const token = jwt.signToken(user.tokenPayload(user))
    const link = `${APP_URL}/verify/${token}`


    res.json({
      data: {
        message: `A mail has been sent to ${email}, please click the link to verify your account`,
      },
    })
    // send an email for user to verify account

    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.VERIFY_EMAIL,
        reciever: email,
        subject: "Verify Your Email",
        locals: { name: `${firstName} ${lastName}`, link },
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )
    if (subscribeToNewsletter)
      EmailList.create({ email })
  }




  /**
   * Verify a users mail
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  verify = async (req, res) => {
    const { token } = req.params
    let decoded
    try {
      decoded = jwt.verifyToken(token, process.env.SECRET)
    } catch (e) {
      console.log("invalid token")
      res.render("login", {
        message: "invalid link, Could not Verify your mail",
      })
      return ""
    }
    // console.log(decoded)
    const { email, name } = decoded
    if (email) {
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
            locals: { name },
          },
          (res) => {
            if (res == null) return
            log.error("Error sending mail", res)
          }
        )
      }
      res.locals = { ...req.locals, message: "Your email has been verified succesfully" }
      res.redirect("/")
    } else
      res.locals = { ...req.locals, message: "invalid link, Could not Verify your mail" }
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
      // console.log(user, company, email)
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
      await user.save()

      res.json({ data: { message: "Password Changed succesfully" } })
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
      User.findById(id).then((doc) => {
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
  update = async function (req, res, next) {
    const {
      user: { id },
      body,
    } = req

    if (
      req.isAuthenticated() &&
      Validator.isMongoId(String(id))
    ) {
      sanitizeBody(body)

      User.findByIdAndUpdate(id, body, { new: true })
        .then(async (user) => {
          if (req.file) {
            const imageUrl = await FileManager.saveFile(
              Storages.PROFILE,
              req.file
            )

            // delete previous file
            if (user.imageUrl && imageUrl) {
              FileManager.deleteFile(user.imageUrl || "")
            }
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
      console.log(err, user, info)
      if (err) {
        console.log(err)
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
        return res.json({ data: { message: `Welcome back ${user.firstName}` } })
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
    // console.log(err, user, next)
    let message
    if (err) {
      if (err instanceof Exception)
        message = err.message
      else {
        message = err.message || 'Authentication failed'
      }
      console.log(user, info, err)
      res.status(400)
      res.locals = { ...locals, message }
      if (String(req.url).includes('register'))
        return res.redirect('/register');
      return res.redirect('/');
      // return res.render('login', { message })
    }
    req.logIn(user, function (err) { 
      // console.log(err)
      return res.redirect('/'); 
   });
    // Successful authentication, redirect home.
    // res.redirect('/');
  }

}




module.exports = new AuthController()
