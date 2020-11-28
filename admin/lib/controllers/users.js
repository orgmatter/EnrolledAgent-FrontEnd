const {
    DB,
    Models: { User },
  } = require("common");

  /**
   * Gets 
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  const getAll = async function (req, res, next) {
    const { page, perpage, q, search, sort } = req.query;
    DB.Paginate(
      res,
      next,
      User,
      {
        perPage: perpage || 3000,
        query: q,
        page,
        sort,
        projections: {hash: 0, salt: 0},
      },
      (data) => {
        req.locals = req.locals || {};
        req.locals = { ...req.locals, ...data, currentPage: "users" };
        res.render("users", { locals: req.locals });
        // console.log(req.locals)
      }
    );
  }
  
  
  
  module.exports = {getAll};
  