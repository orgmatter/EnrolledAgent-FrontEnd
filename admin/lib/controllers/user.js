const {
  DB,
  FileManager, Storages, Helper, Validator,
  Exception, ErrorCodes, ErrorMessage, EmailTemplates, MailService, AwsService,
  Models: { User, AdminUser, ResetToken, VerificationToken },
  Constants,
} = require("common");
const uid = require("uid");
const BaseController = require("./baseController");

/**
* make sure protected content is not overriden
* @param  {string} body
*/
const sanitizeBody = function (body) {
  delete body.updatedAt;
  delete body.createdAt;
  delete body._id;
  delete body.salt;
  delete body.hash;
  delete body.isActive;
  delete body.isEmailVerified;
  delete body.accountType;
  delete body.isSuperAdmin;
}


class UserController extends BaseController {
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
    } = req;
    sanitizeBody(body);

    AdminUser.findByIdAndUpdate(id, body, { new: true })
      .then(async (user) => {
        if (req.file) {
          const imageUrl = req.file.location

          if (user.imageUrl && imageUrl) {
            AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(user.imageUrl))
          }
          user.imageUrl = imageUrl;
          user.save()
        }
        res.json({ data: { message: 'profile updated successfully' } })
      })
      .catch((err) => {
        next(err);
      });

  };

  changePassword = async function (req, res, next) {
    const { user: { email }, body: { password, oldPassword } } = req
    const user = await AdminUser.findOne({ email }).exec()
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
          'Your password is not correct, please use a valid password',
          ErrorCodes.INCORRECT_PASSWORD
        )
      )
    }
    if (!Validator.password(password))
      return next(
        new Exception(
          'Password must have atleast one lowercase character, an uppercase character, a number or a special character, and is at least 6 characters long',
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    user.setPassword(password)
    user.passwordChangedAt = new Date()
    await user.save()

    res.json({ data: { message: 'Password Changed succesfully' } })
  }

  profile = async function (req, res, next) {
    const { user: { id } } = req
    const user = await AdminUser.findByIdAndUpdate(id).exec()
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


    res.json({ data: Helper.formatUser(user) })
  }


  deactivateAccount = async function (req, res, next) {
    const { params: { id } } = req
    const user = await User.findByIdAndUpdate(id, { isActive: false }).exec()
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


    res.json({ data: { message: 'User account deactivated successfully' } })
  }

  activateAccount = async function (req, res, next) {
    const { params: { id } } = req
    const user = await User.findByIdAndUpdate(id, { isActive: true }).exec()
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


    res.json({ data: { message: 'User account activated successfully' } })
  }



  /**
   * Send email link to reset password
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  forgotPassword = async function (req, res, next) {
    const { email } = req.body;
    if (!Validator.email(email))

      // console.log(user, company, email)
      if (!email || !Validator.email(email)) {
        res.statusCode = 422;
        return next(
          new Exception(
            ErrorMessage.REQUIRED_EMAIL,
            ErrorCodes.REQUIRED_EMAIL
          )
        );
      }
    const user = await AdminUser.findOne({ email }).exec();
    if (user) {

      ResetToken.deleteMany({ user: user._id }).exec()

      const token = uid(32)
      ResetToken.create({ user: user._id, token })

      // console.log(user, token)

      const name = `${user.firstName} ${user.lastName}`
      const link = `${process.env.ADMIN_URL}/auth/reset/${token}`

      new MailService().sendMail(
        {
          template: EmailTemplates.RESET_EMAIL,
          reciever: email,
          subject: "Reset Password ",
          locals: { name, link },
        },
        (res) => {
          if (res == null) return;
          log.error("Error sending mail", res);
        }
      );
    }

    res.json({ data: { message: "A reset link has been sent to your mail" } })
  }

  /**
   * Validate email link to reset password
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  passwordResetLink = async (req, res, next) => {
    const { params: { token } } = req;

    let reset = await ResetToken.findOne({ token }).exec()
    if (!(reset && reset.token)) {
      return next(
        new Exception(
          'Your reset link is either epired or invalid',
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    }
    // const {token} = reset
    reset.deleteOne().then(() => { })

    const t = uid(32)
    ResetToken.create({ user: reset.user, token: t })
      .then(() => { })

    super.handleResult({ token: t }, res, next)
  }

  /**
   * Reset password if a reset code exists in session
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  async resetPassword(req, res, next) {
    const { body: { token, password } } = req;
    let reset = await ResetToken.findOne({ token }).exec()
    let user
    if (reset && reset.user)
      user = await AdminUser.findById(reset.user)

    if (!(reset && reset.token && user && user._id)) {
      return next(
        new Exception(
          'Your reset session is either expired or invalid, please try again',
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    }

    if (!password) {
      res.statusCode = 422;
      return next(
        new Exception(
          ErrorMessage.REQUIRED_PASSWORD,
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    }
    if (!Validator.password(password))
      return next(
        new Exception(
          'Password must have atleast one lowercase character, an uppercase character, a number or a special character, and is at least 6 characters long',
          ErrorCodes.REQUIRED_PASSWORD
        )
      )
    user.setPassword(password);
    user.passwordChangedAt = new Date()
    await user.save();

    reset.deleteOne().then(() => { })

    res.json({ data: { message: "Password Changed succesfully" } });
  }



  /**
   * Get user roles
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  async staffRole(req, res, next) {
    if (req.user && req.user.id)
      AdminUser.findById(req.user.id)
        .populate('role')
        .then((doc) => {
          if (doc) {
            req.locals = req.locals || {};
            let userPermissions = []
            if (doc.superAdmin === true)
              userPermissions = Object.values(Permission.ADMIN)
            else if (doc.role && doc.role.permissions)
              userPermissions = doc.role.permissions
            if (!userPermissions) userPermissions = []

            for (const [key, permission] of Object.entries(Permission.ADMIN)) {
              req.locals[permission] = Helper.checkPermission(userPermissions || [], permission)
            }
          }
          next();
        })
    else next()

  }

  async get(req, res, next) {
    const { id } = req.params
    if (!BaseController.checkId('Invalid user id', req, res, next)) return
    let resource = await User.findById(id, { hash: 0, salt: 0 })
      .populate('role')
      .exec()
    super.handleResult(resource, res, next)
  }

  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query
    let query = Helper.parseQuery(q) || {}
    if (search) query = { title: { $regex: search, $options: 'i' } }

    DB.Paginate(res, next, User, {
      perPage: perpage,
      query,
      page,
      sort: { createdAt: -1 },
      projections: { salt: 0, hash: 0 }
    }, (data) => {
      super.handleResultPaginated({ ...data }, res, next)
    })
  }


}

module.exports = new UserController
