const {
    Exception,
    ErrorCodes,
    ErrorMessage,
    Validator,
    Helper,
    Models: { Role, AdminUser },
  } = require("common");
  
  
  /**
   * Get roles
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  const role = async function (req, res, next) {
    Role.find({}, { name: 1 })
      .sort({ name: 1 })
      .then((docs) => {
        // console.log(docs);
        req.locals = req.locals || {};
        req.locals.role = docs;
        next();
      });
  };
  
  ;
  
  /**
   * update a audio record, if a file was uploaded,
   * it saves the file to storge
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  const update = async function (req, res, next) {
    const {
      params: { id },
      body: { name },
    } = req;
    if (
      Helper.isAdmin(req.user || {}) &&
      Validator.isMongoId(String(id))
    ) {
      if (!name)
        return next(
          new Exception("Please enter role name", ErrorCodes.REQUIRED)
        );
  
      Role.findByIdAndUpdate(id, { name }, { new: true })
        .then(async (cat) => {
          // log that an audio was updated succesfully
          //   new LogModel({
          //     secret: config.PUB_SUB_SECRET,
          //     category: LogCategory.AUDIO,
          //     user: req.user.id,
          //     ip: req.ip,
          //     action: LogAction.AUDIO_UPDATED,
          //     message: `Audio updated: ${audio.title}`,
          //   });
          // }
          res.json({ data: { message: "role updated succesfully" }}, res, next);
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
  
  
  /**
   *create
   * it saves the file to storge
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  const create = async function (req, res, next) {
      const {
        body: { name },
      } = req;
      if (
        Helper.isAdmin(req.user || {})
      ) {
        if (!name)
          return next(
            new Exception("Please enter role name", ErrorCodes.REQUIRED)
          );
  
          if (await Role.exists({name}))
          return next(
            new Exception(`Role with name: ${name} already exists`, ErrorCodes.REQUIRED)
          );
    
        Role.create({ name })
          .then(async (cat) => {
            // log that an audio was updated succesfully
            //   new LogModel({
            //     secret: config.PUB_SUB_SECRET,
            //     category: LogCategory.AUDIO,
            //     user: req.user.id,
            //     ip: req.ip,
            //     action: LogAction.AUDIO_UPDATED,
            //     message: `Audio updated: ${audio.title}`,
            //   });
            // }
            res.json({ data: { message: "role created succesfully" }}, res, next);
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
  
    /**
   *create
   * it saves the file to storge
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  const del = async function (req, res, next) {
    const {
      params: { id },
    } = req;
    if (
      Helper.isAdmin(req.user || {}) &&
      Validator.isMongoId(String(id))
    ) {
      if(await AdminUser.exists({role: id})){
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
          // log that an audio was updated succesfully
          //   new LogModel({
          //     secret: config.PUB_SUB_SECRET,
          //     category: LogCategory.AUDIO,
          //     user: req.user.id,
          //     ip: req.ip,
          //     action: LogAction.AUDIO_UPDATED,
          //     message: `Audio updated: ${audio.title}`,
          //   });
          // }
          res.json({ data: { message: "category deleted succesfully" }}, res, next);
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
  
  module.exports = {
    update,
    create,
    del,
    role
  };
  