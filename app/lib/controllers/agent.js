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
  Models: { Agent, City, AgentMessage, ListingRequest, ClaimListing, Log },
} = require("common");
const Payment = require("payment_module");
const mongoose = require("mongoose");

const BaseController = require("../controllers/baseController");
Agent.syncIndexes();
const SORT = { transaction: -1, adminPremium: -1, rating: -1 }
class AgentController extends BaseController {



  async premium(req, res, next) {
    if (!(req.isAuthenticated() && req.user))
      return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

    const agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    console.log(agent)
    if (!agent || !agent._id) {
      res.status(422)
      return next(
        new Exception(
          'Only verified agents can upgrade to premium',
          ErrorCodes.REQUIRED
        )
      )
    }


    Payment.init('upgrade', { agent: agent._id, email: agent.email })
      .then((result) => res.json(result))
      .catch((err) => next(err))

    // super.handleResult({ data: { message: 'Your request has been submitted, you will be  contacted appropriately' } }, res, next)
  }

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
    if (!agent || agent.owner != req.user.id)
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

  /**
    * Submit a request for your listing to be added
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
 */
  async createListing(req, res, next) {
    // req.user = {id: '5ffdafd6b8a81f35855444e0'}

    if (!(req.isAuthenticated() && req.user))
      return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

    const body = req.body || { '': '' }
    delete body.status

    if (!body.firstName || !body.lastName) {
      return next(new Exception('First name and last name is required', ErrorCodes.NO_PRIVILEGE))
    }

    if (!body.email || !body.phone) {
      return next(new Exception('Email and phone number is required', ErrorCodes.NO_PRIVILEGE))
    }

    if (!body.zipcode || !body.city || !body.state) {
      return next(new Exception('zipcode, state and city is required', ErrorCodes.NO_PRIVILEGE))
    }

    if (!body.licence || !body.stateLicenced) {
      return next(new Exception('licence, and state licenced state is required', ErrorCodes.NO_PRIVILEGE))
    }

    let licenceProof

    if (req.file) {
      licenceProof = await FileManager.saveFile(
        Storages.DOCS,
        req.file
      )
    }

    if (!licenceProof) {
      return next(new Exception('Proof of licence is required', ErrorCodes.NO_PRIVILEGE))
    }

    body.user =  req.user.id
    body.licenceProof = licenceProof
    delete body.agent


     await ListingRequest.create(body)
    // console.log(data)

    res.json({ data: { message: 'Your listing request has been submitted, you will be contacted appropriately' } })
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
    if (Validator.isMongoId(id)) agent = await Agent.findById(id)
      .populate([
        { path: "review" },
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .exec();
    req.locals.agent = agent;
    // console.log(agent)
    next();
    if (agent)
      Agent.findByIdAndUpdate(agent._id, { $inc: { viewCount: 1 } }).exec();
  }



  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query;
    let query = Helper.parseQuery(q) || {};
    if (search) query = { $text: { $search: search } };
    // console.log(req.url)
    // query = {}

    DB.Paginate(
      res,
      next,
      Agent,
      {
        perPage: perpage,
        query,
        page,
        // sort: { viewCount: -1 },
        sort: SORT,
        populate: [
          { path: "reviewCount", select: ["rating"] },
          { path: "owner", select: ["_id", "firstName"] },
        ],
      },
      (data) => {
        req.locals.agents = data;
        // console.log(data);
        next();
      }
    );
  }

  async getAgentMessages(req, res, next) {
    req.locals.agentMessage = {}
    const { page, perpage, q, search } = req.query
    let query = Helper.parseQuery(q) || {}
    if (search) query = { $text: { $search: search } }
    let agent
    if (req.isAuthenticated() && req.user) {
        agent = await Agent.findOne({ owner: Types.ObjectId(req.user.id) }).exec()
    }

    if (!agent  || agent._id) return  next()
   
    DB.Paginate(
      res,
      next,
      AgentMessage,
      {
        perPage: perpage,
        query,
        page,
        query: { agent: agent._id },
        // sort: { viewCount: -1 },
        // sort: SORT,
        // populate: [],
      },
      (data) => {
        req.locals.agentMessage = data
        console.log(data)
        next()
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
        sort: SORT,
        populate: [
          { path: "reviewCount", select: ["rating"] },
          { path: "owner", select: ["_id", "firstName"] },
        ],
      },
      (data) => {
        req.locals.agents = data;
        req.locals.city = _city;
        // console.log(req.locals, query);
        next();
        if (data && data.length > 0)
          City.findByIdAndUpdate(_city._id, { $inc: { count: 1 } }).exec();
      }
    );

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
      .sort(SORT)
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
      .sort(SORT)
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
      .sort(SORT)
      // .sort({ rating: -1 })
      .exec();
    req.locals.popular = data;
    next();
  }
}

module.exports = new AgentController();

///TODO :Set cronjob to calculate rating
