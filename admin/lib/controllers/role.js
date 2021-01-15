const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  Validator,
  Helper,
  LogAction,
  LogCategory,
  DB,

  Models: { Role, Log },
} = require("common");
const { AdminUser } = require("common/lib/models");

const BaseController = require('../controllers/baseController');
class RoleController extends BaseController {

  /**
   * Get roles
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  role = async (req, res, next) => {
    Role.find({}, { name: 1 })
      .sort({ name: 1 })
      .then((docs) => {
        super.handleResult(docs, res, next)
      });
  };


  /**
   * Get roles
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  roleWithPermission = async (req, res, next) => {
    Role.find({},)
      .sort({ name: 1 })
      .then((docs) => {
        req.locals = req.locals || {};
        req.locals.role = docs;
        next();
      });
  };

  ;

  /**
   * update  a role
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  update = async (req, res, next) => {
    const {
      params: { id },
      body
    } = req;
    if (!BaseController.checkId('Invalid role id', req, res, next)) return

   

    Role.findByIdAndUpdate(id, body, { new: true })
      .then(async (cat) => {
        res.json({ data: { message: "role updated succesfully" } }, res, next);
        await Log.create({
          user: req.user.id,
          action: LogAction.ROLE_UPDATED,
          category: LogCategory.ROLE,
          resource: cat._id,
          ip: Helper.getIp(req),
          message: 'Resource Updated'
        })
      })
      .catch((err) => {
        next(err);
      });
  }


  /**
   *create  a role
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  create = async (req, res, next) => {
    const {
      body: { name, permissions },
    } = req;

    if (!name)
      return next(
        new Exception("Please enter role name", ErrorCodes.REQUIRED)
      );

    if (await Role.exists({ name }))
      return next(
        new Exception(`Role with name: ${name} already exists`, ErrorCodes.REQUIRED)
      );

    Role.create({ name, permissions })
      .then(async (cat) => {
        res.json({ data: { message: "role created succesfully" } }, res, next);
        await Log.create({
          user: req.user.id,
          action: LogAction.ROLE_CREATED,
          category: LogCategory.ROLE,
          resource: cat._id,
          ip: Helper.getIp(req),
          message: 'Resource Created'
        })
      })
      .catch((err) => {
        next(err);
      });

  }


  /**
  * deletes a role
  * @param  {Express.Request} req
  * @param  {Express.Response} res
  * @param  {function} next
  */
  async delete(req, res, next) {
    const {
      params: { id },
    } = req;

    if (await AdminUser.exists({ role: id })) {
      res.status(422);
      return next(
        new Exception(
          "Cannot delete this role, please assign a new role to users with this role",
          ErrorCodes.REQUIRED_COMPANY_DETAILS
        )
      );
    }

    Role.findByIdAndDelete(id)
      .then(async (cat) => {
        res.json({ data: { message: "role deleted succesfully" } }, res, next);
        await Log.create({
          user: req.user.id,
          action: LogAction.ROLE_DELETED,
          category: LogCategory.ROLE,
          resource: cat._id,
          ip: Helper.getIp(req),
          message: 'Resource Deleted'
        })
      })
      .catch((err) => {
        next(err);
      });
  }

  async get(req, res, next) {
    const { id } = req.params
    if (!BaseController.checkId('Invalid role id', req, res, next)) return
    const resource = await Role.findById(id)
      .populate(['sponsor', 'category'])
      .exec()
    super.handleResult(resource, res, next)
  }

  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query
    let query = Helper.extractQuery(req.query) || {}
    if (q) query = { title: { $regex: q, $options: 'i' } }

    DB.Paginate(res, next, Role, {
      perPage: perpage,
      query,
      page,
    }, (data) => {
      super.handleResultPaginated({ ...data }, res, next)
    })
  }

}

module.exports = new RoleController
