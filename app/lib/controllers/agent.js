const {
  Exception,
  ErrorCodes,
  ErrorMessage,
  Constants,
  LogCategory,
  LogAction,
  AwsService,
  EmailTemplates,
  MailService,
  Validator,
  RedisService,
  Helper,
  Logger,
  DB,
  Models: { Agent, City, AgentMessage, ListingRequest, ContactPreference, ClaimListing, Log },
} = require("common");
const Payment = require("payment_module");
const mongoose = require("mongoose");
const log = new Logger("App:agent");

const BaseController = require("../controllers/baseController");
Agent.syncIndexes();
const SORT = { transaction: -1, adminPremium: -1, rating: -1 }
class AgentController extends BaseController {



  async premium(req, res, next) {
    if (!(req.isAuthenticated() && req.user))
      return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

    const agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
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

    let agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    if (!agent || !agent._id) {
      res.status(422)
      AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
      return next(
        new Exception(
          'Only verified agents can update their profile',
          ErrorCodes.REQUIRED
        )
      )
    }
    if (!agent || agent.owner != req.user.id)
      return next(new Exception('You can only update your listing', ErrorCodes.NO_PRIVILEGE))



    agent = await Agent.findByIdAndUpdate(agent._id, body, { new: true })

    if (req.file) {
      const imageUrl = req.file.location
      if (agent.imageUrl && imageUrl) AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(agent.imageUrl))

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

  async contactPreference(req, res, next) {

    const body = req.body || { '': '' }

    if (!(req.isAuthenticated() && req.user))
      return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))

    let agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    if (!agent || !agent._id) {
      res.status(422)
      return next(
        new Exception(
          'Only verified agents can perform this operation',
          ErrorCodes.REQUIRED
        )
      )
    }
    if (!agent || agent.owner != req.user.id)
      return next(new Exception('You can only update your own listing', ErrorCodes.NO_PRIVILEGE))

    body.agent = agent._id
    await ContactPreference.findOneAndUpdate({ agent: agent._id }, body, { upsert: true })
    // agent = await Agent.findByIdAndUpdate(agent._id, body, { new: true })


    super.handleResult({ message: 'Contact preference updated succesfully' }, res, next)
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

    let agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    if (agent && agent._id) {
      res.status(422)
      AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
      return next(
        new Exception(
          'You have previously claimed a listing, you cannot claim another',
          ErrorCodes.REQUIRED
        )
      )
    }

    const body = req.body || { '': '' }
    delete body.status

    if (!body.firstName || !body.lastName) {
      AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
      return next(new Exception('First name and last name is required', ErrorCodes.NO_PRIVILEGE))
    }

    if (!body.email || !body.phone) {
      AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
      return next(new Exception('Email and phone number is required', ErrorCodes.NO_PRIVILEGE))
    }

    if (!body.zipcode || !body.city || !body.state) {
      AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
      return next(new Exception('zipcode, state and city is required', ErrorCodes.NO_PRIVILEGE))
    }

    if (!body.licence || !body.stateLicenced) {
      AwsService.deleteFile(Helper.getAwsFileParamsFromUrl(req.file.location))
      return next(new Exception('licence, and state licenced state is required', ErrorCodes.NO_PRIVILEGE))
    }

    let licenceProof

    if (req.file) {
      licenceProof = req.file.location
    }

    if (!licenceProof) {
      return next(new Exception('Proof of licence is required', ErrorCodes.NO_PRIVILEGE))
    }

    body.user = req.user.id
    body.licenceProof = licenceProof
    delete body.agent


    await ListingRequest.create(body)
    // log.info(data)

    res.json({ data: { message: 'Your listing request has been submitted, you will be contacted appropriately' } })

    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.INFO,
        reciever: process.env.DEFAULT_EMAIL_SENDER,
        subject: 'Listing Request',
        locals: {
          message: `
        <p>Hello Admin,  </p>
        <p>A user just requested to list his profile, please visit the admin portal to check this out.</p><br>
        <p></p>
        `},
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )
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

    let agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    if (agent && agent._id) {
      res.status(422)
      return next(
        new Exception(
          'You have previously claimed a listing, you cannot claim another',
          ErrorCodes.REQUIRED
        )
      )
    }


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

    super.handleResult({ data: { message: 'Your request has been submitted, you will be  contacted shortly' } }, res, next)

    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.INFO,
        reciever: process.env.DEFAULT_EMAIL_SENDER,
        subject: 'Listing Claim Request',
        locals: {
          message: `
        <p>Hello Admin,  </p>
        <p>A new listing claim request has been sent, please visit the admin portal to check this out.</p><br>
        <p></p>
        `},
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )
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
      // .lean()
      .exec()
    else next()
    if (!agent) {
      req.session.error = 'Agent not found'
      return res.redirect('/ea-listings')
    } 
    if (agent.isActive == false) {
      req.session.error = 'Agent not found'
      return res.redirect('/ea-listings')
    } req.locals.agent = agent;
    // log.info(agent)
    next();
    if (agent)
      Agent.findByIdAndUpdate(agent._id, { $inc: { viewCount: 1 } }).exec();
  }


  async profile(req, res, next) {
    req.locals.agentProfile = {}
    if (!(req.isAuthenticated() && req.user))
      return next()

    let agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) })
      .populate([
        'preference',
        { path: "review" },
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      // .lean()
      .exec();
    req.locals.agentProfile = agent;
    next();
  }



  async getAll(req, res, next) {
    const { page, perpage, q, search } = req.query;
    
    let cacheKey = req.url.substring(1),cachedData;
    cacheKey = Constants.CACHE_KEYS.AGENTS+cacheKey
    console.log(cacheKey)
    
    cachedData = await RedisService.get(cacheKey)
   
    if(cachedData){
      cachedData = JSON.parse(cachedData)
      req.locals.agents = cachedData;
      next();
      return;
    }

    let query = Helper.parseQuery(q) || {};
    if (search) query = { $text: { $search: search, $caseSensitive: false } };
    
    if (query.state)
      query.state = new RegExp(["^", query.state, "$"].join(""), "i");
    log.info(query)

    DB.Paginate(
      res,
      next,
      Agent,
      {
        perPage: perpage,
        query:{...query, 
          $or: [
            { isActive: { $exists: false }},
            { isActive: true }
          ],
},
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
        RedisService.save(cacheKey, JSON.stringify(data))
        // log.info(data);
        next();
      }
    );
  }

  async getAgentMessages(req, res, next) {
    req.locals.agentMessage = { data: [] }
    const { page, perpage, q, search } = req.query
    let query = Helper.parseQuery(q) || {}
    if (search) query = { $text: { $search: search } }
    let agent
    if (req.isAuthenticated() && req.user) {
      agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    }

    if (!agent || !agent._id) return next()

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
        // log.info(data)
        next()
      }
    );
  }

  async getAgentMessage(req, res, next) {
    req.locals.agentMessage = {}
    const { id } = req.params
    if (!id || !Validator.isMongoId(String(id))) return next()
    let agent
    if (req.isAuthenticated() && req.user) {
      agent = await Agent.findOne({ owner: mongoose.Types.ObjectId(req.user.id) }).exec()
    }

    if (!agent || !agent._id) return next()

    let resource = await AgentMessage.findById(id)
      .lean()
      .exec()
    if (resource && resource.agent == agent._id)
      req.locals.agentMessage = resource
    next()
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
        query: {...query , 
          $or: [
            { isActive: { $exists: false }},
            { isActive: true }
          ]},
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
        // log.info(req.locals, query);
        next();
        if (data && data.length > 0)
          City.findByIdAndUpdate(_city._id, { $inc: { count: 1 } })
            .lean()
            .exec();
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

    const data = await Agent.find({  $or: [
      { isActive: { $exists: false }},
      { isActive: true }
    ] })
      .skip(random)
      .limit(10)
      .populate([
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .sort(SORT)
      .lean()
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
    const query = { } || { stateSlug: state }; // TODO: ADD CORRECT QUERY WHEN DATABASE IS SEEDED CORRECTLY
    const count = await Agent.estimatedDocumentCount(query).exec();
    const random = Math.floor(Math.random() * count);

    const data = await Agent.find({...query, $or: [
      { isActive: { $exists: false }},
      { isActive: true }
    ]})
      .skip(random)
      .limit(6)
      .populate([
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .sort(SORT)
      .lean()
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
    let data ;
    data = await RedisService.get(Constants.CACHE_KEYS.POPULAR_AGENTS)
    if(data)
    data = JSON.parse(data)
    if(!data){
    const count = await Agent.estimatedDocumentCount().exec();
    const random = Math.floor(Math.random() * count);

     data = await Agent.find({$or: [
      { isActive: { $exists: false }},
      { isActive: true }
    ]})
      .skip(random)
      .limit(4)
      .populate([
        { path: "reviewCount", select: ["rating"] },
        { path: "owner", select: ["_id", "firstName"] },
      ])
      .sort(SORT)
      .lean()
      // .sort({ rating: -1 })
      .exec();
  }
    req.locals.popular = data;
    next();
  }
  findAgentsByZipCode(zipCode, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const regex = new RegExp(zipCode, 'i');
        let agents = [];
        if(type === 'zip') {
          agents = await Agent.find({"zipcode":regex}).limit(20);
        } else {
          agents = await Agent.find({"state":regex}).limit(20);
        }
        if(agents.length > 0)  {
          let results = [];
          agents.forEach(agen => {
            let obj = {
              label: `${agen.city}, ${agen.state}, ${agen.zipcode}`
            }
            results.push(obj)
          });
          
          resolve(results)
        } else {
          resolve([])
        }
      } catch (error) {
        rejec(error)
      }
    })
  }

  findAgentsBylastName(zipCode, type, lastName) {
    return new Promise(async(resolve, reject) => {
      try {
        let firstSearchValue = '';
        const regex = new RegExp(lastName, 'i');
        if(type === "zip" && zipCode !=="") {
          firstSearchValue = zipCode.split(',')[2].trim()
        } else if (type !== 'zip' && zipCode !=="") {
          firstSearchValue = zipCode.split(',')[1].trim()
        } else {
          firstSearchValue = ''
        }
        let agents = [];
        if(type === 'zip') {
          if(firstSearchValue !=="") {
            agents = await Agent.find({"lastName":regex, "zipcode": firstSearchValue}).limit(20);
          } else {
            agents = await Agent.find({"lastName":regex}).limit(20);
          }
        } else if(type !== 'zip') {
          if(firstSearchValue !=="") {
            agents = await Agent.find({"lastName":regex, "state": firstSearchValue}).limit(20);
          } else {
            agents = await Agent.find({"lastName":regex}).limit(20);
          }
        }

        if(agents.length > 0)  {
          let results = [];
          agents.forEach(agen => {
            let obj = {
              label: `${agen.firstName}, ${agen.lastName}`
            }
            results.push(obj)
          });
          
          resolve(results)
        } else {
          resolve([])
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}


module.exports = new AgentController();

///TODO :Set cronjob to calculate rating
