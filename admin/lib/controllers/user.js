const {
  DB,
  FileManager, Storages, Helper,
  Exception, ErrorCodes, ErrorMessage,
  Models: { User, AdminUser },
} = require("common");
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

    if (
      req.user
    ) {
      sanitizeBody(body);

      AdminUser.findByIdAndUpdate(id, body, { new: true })
        .then(async (user) => {
          if (req.file) {
            const imageUrl = await FileManager.saveFile(
              Storages.PROFILE,
              req.file
            );
            if (user.imageUrl && imageUrl) {
              FileManager.deleteFile(user.imageUrl || "");
            }
            user.imageUrl = imageUrl;
            user.save()
          }
          res.json({ data: { message: 'profile updated successfully' } })
        })
        .catch((err) => {
          next(err);
        });
    } else {
      next(
        new Exception(
          // eslint-disable-next-line new-cap
          ErrorMessage.NO_PRIVILEGE,
          ErrorCodes.NO_PRIVILEGE
        )
      );
    }
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
    user.setPassword(password)
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



  // /**
  //  * Send email link to reset password
  //  * @param  {Express.Request} req
  //  * @param  {Express.Response} res
  //  * @param  {Function} next
  //  */
  // forgotPassword = async function (req, res, next) {
  //   const { email } = req.body;
  //   if (!Validator.email(email))

  //     // console.log(user, company, email)
  //     if (!email || !Validator.email(email)) {
  //       res.statusCode = 422;
  //       return next(
  //         new Exception(
  //           ErrorMessage.REQUIRED_EMAIL,
  //           ErrorCodes.REQUIRED_EMAIL
  //         )
  //       );
  //     }
  //   const user = await AdminUser.findOne({ email }).exec();
  //   if (user) {
  //     if (ResetToken.exists({ user: user._id }))
  //       ResetToken.deleteMany({ user: user._id }).exec()

  //     const token = uid(32)
  //     ResetToken.create({ user: user._id, token })
  //       .then(() => { })

  //     // console.log(user, token)

  //     const name = `${user.firstName} ${user.lastName}`
  //     const link = `${process.env.ADMIN_URL}/reset_password/${token}`

  //     new MailService().sendMail(
  //       {
  //         template: EmailTemplates.PASSWORD_RESET,
  //         reciever: email,
  //         subject: "Reset Password ",
  //         locals: { name, link },
  //       },
  //       (res) => {
  //         if (res == null) return;
  //         log.error("Error sending mail", res);
  //       }
  //     );
  //   }

  //   res.json({ data: { message: "A reset link has been sent to your mail" } })
  // }

  // /**
  //  * Validate email link to reset password
  //  * @param  {Express.Request} req
  //  * @param  {Express.Response} res
  //  * @param  {Function} next
  //  */
  // passwordResetLink = async function (req, res, next) {
  //   const { params: { token } } = req;

  //   let reset = await ResetToken.findOne({ token }).exec()
  //   if (!(reset && reset.token)) {
  //     req.locals.infoMessage = 'Your reset link is either epired or invalid'
  //     return req.isAuthenticated() ? res.redirect('/') : res.render('login', { locals: req.locals })
  //   }
  //   reset.deleteOne().then(() => { })

  //   const tokn = uid(32)
  //   ResetToken.create({ user: reset.user, token: tokn })
  //     .then(() => { })

  //   req.session.resetToken = tokn

  //   res.redirect('/reset-pword');

  // }

  // /**
  //  * Reset password if a reset code exists in session
  //  * @param  {Express.Request} req
  //  * @param  {Express.Response} res
  //  * @param  {Function} next
  //  */
  // async resetPassword(req, res, next) {
  //   const { body } = req; 
  //   const token = req.session.resetToken
  //   let reset = await ResetToken.findOne({ token }).exec()
  //   let user
  //   if (reset && reset.user)
  //     user = await AdminUser.findById(reset.user) 

  //   if (!(reset && reset.token && user && user._id)) {
  //     return next(
  //       new Exception(
  //         'Your reset session is either expired or invalid, please try again',
  //         ErrorCodes.REQUIRED_PASSWORD
  //       )
  //     )
  //   }


  //   if (!body.password) {
  //     res.statusCode = 422;
  //     return next(
  //       new Exception(
  //         ErrorMessage.REQUIRED_PASSWORD,
  //         ErrorCodes.REQUIRED_PASSWORD
  //       )
  //     )
  //   }
  //   user.setPassword(body.password);
  //   await user.save();

  //   reset.deleteOne().then(() => { })
  //   req.session.resetToken = null

  //   res.json({ data: { message: "Password Changed succesfully" } });
  // }



  // /**
  //  * Get user roles
  //  * @param  {Express.Request} req
  //  * @param  {Express.Response} res
  //  * @param  {function} next
  //  */
  // async staffRole(req, res, next) {
  //   if (req.user && req.user.id)
  //     AdminUser.findById(req.user.id)
  //       .populate('role')
  //       .then((doc) => {
  //         if (doc) {
  //           req.locals = req.locals || {};
  //           let userPermissions = []
  //           if (doc.superAdmin === true)
  //             userPermissions = Object.values(Permission.ADMIN)
  //           else if (doc.role && doc.role.permissions)
  //             userPermissions = doc.role.permissions
  //           if (!userPermissions) userPermissions = []

  //           for (const [key, permission] of Object.entries(Permission.ADMIN)) {
  //             req.locals[permission] = Helper.checkPermission(userPermissions || [], permission)
  //           }
  //         }
  //         next();
  //       })
  //   else next()

  // }


  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query
    let query = Helper.parseQuery(q) || {}
    if (search) query = { title: { $regex: search, $options: 'i' } }

    DB.Paginate(res, next, User, {
        perPage: perpage,
        query,
        page, 
        projection: {salt: 1, hash: 1}
    }, (data)=>{
        super.handleResultPaginated({...data}, res, next) 
    })

}


}

module.exports = new UserController
