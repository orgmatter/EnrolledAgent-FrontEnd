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
      const { params: { id } } = req
      if (!BaseController.checkId('Invalid agent id', req, res, next)) return
  
      const body = req.body || { '': '' }
      delete body.rating
      delete body.owner
  
      if (!(req.isAuthenticated() && req.user))
      return next(new Exception(ErrorMessage.NO_PRIVILEGE, ErrorCodes.NO_PRIVILEGE))
  
      let agent = await Agent.findById(id).exec()
  
      if(!agent)
      return next(new Exception('Agent not found', ErrorCodes.NO_PRIVILEGE))
  
  
      if(agent.owner != req.user.id)
      return next(new Exception('You can only update your listing', ErrorCodes.NO_PRIVILEGE))
      
      
  
       agent = await Agent.findByIdAndUpdate(id, body, { new: true })
  
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
  
  
  }
  
  module.exports = new AgentController();
  
  