const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  Storages,
  Logger,
  LogAction,
  LogCategory,
  FileManager,
  Validator,
  Helper,
  DB,
  EmailTemplates,
  MailService,
  Constants,
  Permission,
  Models: { AdminUser, LogModel, Role, },
} = require("common");



// const config = require("../../config");

const log = new Logger("auth:staff");

const BaseController = require('../controllers/baseController');

/**
 * make sure protected content is not overriden
 * @param  {string} body
 */
const sanitizeBody = function (body) {
  delete body.updatedAt;
  delete body.createdAt;
  delete body.status;
  delete body.email;
  delete body.salt;
  delete body.hash;
  delete body._id;
};


class StaffController extends BaseController {

  // Adds new staff record
  /**
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  create = async (req, res, next) => {
    const {
      body,
    } = req;
    log.info("addstaff ", body);
    if (!("email" in body) && !Validator.email(body.email)) {
      res.status(422);
      return next(
        new Exception(
          "Staff email must be a valid email",
          ErrorCodes.REQUIRED
        )
      );
    }

    if (req.user.email === body.email) {
      res.status(422);
      return next(
        new Exception(
          "You cannot add yourself as a staff",
          ErrorCodes.REQUIRED
        )
      );
    }

    if (!("firstName" in body) || !("lastName" in body)) {
      res.status(422);
      return next(
        new Exception(
          "Staff first name and last name is required",
          ErrorCodes.REQUIRED
        )
      );
    }

    if (
      !("jobTitle" in body) ||
      !("role" in body) ||
      !Validator.isMongoId(body.role)
    ) {
      res.status(422);
      return next(
        new Exception(
          "Job Title and role is required",
          ErrorCodes.REQUIRED
        )
      );
    }
    if (!(await Role.exists({ _id: body.role }))) {
      res.status(422);
      return next(
        new Exception(
          "Invalid role",
          ErrorCodes.REQUIRED
        )
      );
    }
    const { email, firstName, lastName, jobTitle, role } = body;

    if (await AdminUser.exists({ email })) {
      res.status(422);
      return next(
        new Exception(
          "Staff already exists, you cannot add a staff twice",
          ErrorCodes.REQUIRED
        )
      );
    }
    const password = Helper.generatePassword();

    let user = new AdminUser({
      accountType: Constants.ACCOUNT_TYPE.admin,
      firstName,
      lastName,
      email,
      jobTitle,
      role,
      isEmailVerified: true,
    });

    user.setPassword(`${password}`);
    await user.save();

    super.handleResult({
      message: `Login credentials has been sent to ${email}`,
    },
      res,
      next
    );
    log.info(" sending mail");

    new MailService().sendMail(
      {
        template: EmailTemplates.NEW_STAFF_ADMIN,
        reciever: email,
        subject: "Admin Account",
        locals: {
          password,
          name: firstName,
          email,
          link: process.env.ADMIN_URL,
        },
      },
      (res) => {
        if (res == null) return;
        log.error("Error sending mail",);
      }
    );

    new LogModel({
      category: LogCategory.ACCOUNT,
      user: req.user.id,
      ip: Helper.getIp(req),
      resource: user._id,
      action: LogAction.ADMIN_ACCOUNT_CREATE,
      message: `Admin account created`,
    });
  }

  /**
   * update a staff record, if a file was uploaded,
   * it saves the file to storge
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  update = async (req, res, next) => {
    const {
      params: { id },
      body,
    } = req;

    sanitizeBody(body);

    AdminUser.findByIdAndUpdate(id, body, { new: true })
      .then(async (staff) => {
        handleResult(staff, res, next);
        new LogModel({
          category: LogCategory.ACCOUNT,
          user: req.user.id,
          ip: Helper.getIp(req),
          resource: staff._id,
          action: LogAction.ADMIN_ACCOUNT_CREATE,
          message: `Admin account created`,
        });
      })
      .catch((err) => {
        next(err);
      });
  }


  // /**
  //  * delete a staff record, if a file was uploaded,
  //  * it saves the file to storge
  //  * @param  {Express.Request} req
  //  * @param  {Express.Response} res
  //  * @param  {function} next
  //  */
  // delete = async (req, res, next) => {
  //   const { params } = req;

  //   AdminUser.findByIdAndDelete(params.id).then((staff) => {
  //     super.handleResult(staff, res, next);

  //     // log that an staff was deleted succesfully
  //     new LogModel({
  //       category: LogCategory.ACCOUNT,
  //       user: req.user.id,
  //       ip: Helper.getIp(req),
  //       resource: staff._id,
  //       action: LogAction.ADMIN_ACCOUNT_DELETE,
  //       message: `Admin account deleted`,
  //     });
  //   });
  // }

  async get(req, res, next) {
    const { id } = req.params
    if (!BaseController.checkId('Invalid user id', req, res, next)) return
    const resource = await AdminUser.findById(id, { hash: 0, salt: 0 })
      .populate(['role'])
      .exec()
    super.handleResult(resource, res, next)
  }

  /**
  * Gets all staff record
  * @param  {Express.Request} req
  * @param  {Express.Response} res
  * @param  {function} next
  */
  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query
    let query = Helper.extractQuery(req.query) || {}
    if (q) query = { title: { $regex: q, $options: 'i' } }

    DB.Paginate(res, next, AdminUser, {
      perPage: perpage,
      query,
      page,
      sort: {createdAt: -1},
      populate: ['role'],
      projections: { hash: 0, salt: 0 }
    }, (data) => {
      super.handleResultPaginated({ ...data }, res, next)
    })
  }

}


module.exports = new StaffController
