const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  FileManager,
  LogCategory,
  LogAction,
  Storages,
  Validator,
  Helper,
  DB,
  Models: { Agent, City, State, ClaimListing, Log },
} = require("common");

const BaseController = require("../controllers/baseController");
Agent.syncIndexes();

class AgentController extends BaseController {

  async update(req, res, next) {

    const body = req.body || { '': '' }
    delete body.rating
    delete body.owner

    if (!(req.isAuthenticated() && req.user))
    return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

    let agent = await Agent.findOne({ owner: req.user.id }).exec()
    if (!agent || !agent._id) {
        res.status(422)
        return next(
            new Exception(
                'Only verified agents can delete articles',
                ErrorCodes.REQUIRED
            )
        )
    }



    if(!agent || agent.owner != req.user.id)
    return next(new Exception('You can only update your listing', ErrorCodes.NO_PRIVILEGE))
    
    

     agent = await Agent.findByIdAndUpdate(agent._id, body, { new: true })

    if (req.file) {
        const imageUrl = await FileManager.saveFile(
            Storages.AGENT_PROFILE,
            req.file
        )
        if (agent.imageUrl && imageUrl) FileManager.deleteFile(agent.imageUrl)

        agent.imageUrl = imageUrl
        await agent.save()
    }
    super.handleResult(agent, res, next)
    await Log.create({
        user: req.user.id,
        action: LogAction.AGENT_UPDATED,
        category: LogCategory.AGENT,
        resource: agent._id,
        ip: Helper.getIp(req),
        message: 'Agent Updated'
    })
}


  async claim(req, res, next) {
    const { params: { id }, body: { jobRole,
      companySize,
      companyName,
      companyRevenue,
      organizationType,
      annualTax } } = req

    if (!BaseController.checkId('Invalid agent id', req, res, next)) return

    if (!(req.isAuthenticated() && req.user))
      return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))


     await ClaimListing.create({
      jobRole,
      companySize,
      companyName,
      companyRevenue,
      organizationType,
      annualTax,
      jobRole,
      agent: id,
      user: req.user.id
    })

    super.handleResult({ data: { message: 'Your request has been submitted, you will be  contacted appropriately' } }, res, next)
  }

  async get(req, res, next) {
    const { id } = req.params;
    let agent;
    if (Validator.isMongoId(id)) agent = await Agent.findById(id).exec();
    req.locals.agent = agent;
    next();
  }

  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query;
    let query = Helper.parseQuery(q) || {};
    if (search) query = { $text: { $search: search } };

    // query = {}

    DB.Paginate(
      res,
      next,
      Agent,
      {
        perPage: perpage,
        query,
        page,
        populate: [
          { path: "reviewCount", select: ["rating"] },
          { path: "owner", select: ["_id", "firstName"] },
        ],
      },
      (data) => {
        req.locals.agents = data;
        console.log(data);
        next();
      }
    );
  }


  async city(req, res, next) {
    const {
      query: { page, perpage, q, search },
      params: { city },
    } = req;
    let query = Helper.parseQuery(q) || {};

    const _city = await City.findOne({ slug: { $regex: new RegExp(city, "i") } });

    if (!_city) return next();

    query.city = { $regex: new RegExp(_city.name, "i") };

    DB.Paginate(
      res,
      next,
      Agent,
      {
        perPage: perpage,
        query,
        page,
        populate: [
          { path: "reviewCount", select: ["rating"] },
          { path: "owner", select: ["_id", "firstName"] },
        ],
      },
      (data) => {
        req.locals.agents = data;
        req.locals.city = _city;
        console.log(req.locals, query);
        next();
      }
    );
    City.findByIdAndUpdate(_city._id, { $inc: { count: 1 } }).exec();
  }


  /**
   * get 10 random agents
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  async random(req, _, next) {
    const count = await Agent.estimatedDocumentCount().exec();
    const random = Math.floor(Math.random() * count);

    const data = await Agent.find({})
      .skip(random)
      .limit(10)
      .populate([
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .sort()
      .exec();
    req.locals.agents = data;
    next();
  }

  /**
   * get 10 random agents
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  async popularInState(req, _, next) {
    const {
      params: { state },
    } = req;
    const query = {} || { stateSlug: state }; // TODO: ADD CORRECT QUERY WHEN DATABASE IS SEEDED CORRECTLY
    const count = await Agent.estimatedDocumentCount(query).exec();
    const random = Math.floor(Math.random() * count);

    const data = await Agent.find(query)
      .skip(random)
      .limit(6)
      .populate([
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .sort({ rating: -1 })
      .exec();
    req.locals.popular = data;
    next();
  }

  /**
   * get 10 random agents
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {function} next
   */
  async popular(req, _, next) {
    const count = await Agent.estimatedDocumentCount().exec();
    const random = Math.floor(Math.random() * count);

    const data = await Agent.find({})
      .skip(random)
      .limit(4)
      .populate([
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .sort({ rating: -1 })
      .exec();
    req.locals.popular = data;
    next();
  }
}

module.exports = new AgentController();

///TODO :Set cronjob to calculate rating
