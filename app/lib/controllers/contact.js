const {
  Exception,
  ErrorCodes,
  FileManager,
  Storages,
  MailService, EmailTemplates,
  Validator,
  Helper,
  DB,
  Models: { Contact, AgentMessage, Agent, AdminUser, EmailList, Offshore },
} = require("common")
const { Types: { ObjectId } } = require("mongoose")


class ContactController {

  async create(req, res, next) {
    const { name, email, subject, message, phone } = req.body

    if (!name || !email || !phone) {
      res.status(422)
      return next(
        new Exception(
          'Name and email is required',
          ErrorCodes.REQUIRED
        )
      )
    }

    if (!Validator.email(email)) {
      res.status(422)
      return next(
        new Exception(
          'Please provide a valid email',
          ErrorCodes.REQUIRED
        )
      )
    }


    if (!subject || !message) {
      res.status(422)
      return next(
        new Exception(
          'Subject and Message is required',
          ErrorCodes.REQUIRED
        )
      )
    }

    await Contact.create({ name, email, subject, message, phone }).then()

    let admin = await AdminUser.find({}).exec()

    if (admin && admin.length > 0) {
      // console.log( admin.map(a=> a.email))

      new MailService().sendMail(
        {
          // secret: config.PUB_SUB_SECRET,
          template: EmailTemplates.CONTACT,
          reciever: admin.map(a => a.email),
          subject: subject,
          locals: { name: name, phone, message, userEmail: email },
        },
        (res) => {
          if (res == null) return
          log.error("Error sending mail", res)
        }
      )
    }

    res.json({ message: 'Thank you for contacting us, your message will be attended to appropriately' })


  }


  /**
      * send an agent a personal message
      * @param  {Express.Request} req
      * @param  {Express.Response} res
      * @param  {Function} next
      */
  async sendAgentMessage(req, res, next) {
    const { name, email, subject, message, phone, agent } = req.body

    if (!agent || !Validator.isMongoId(String(agent)))
      return next(
        new Exception(
          'Invalid request',
          ErrorCodes.REQUIRED
        )
      )

    let _agent = await Agent.findById(agent).exec()
    if (!_agent || !_agent._id) {
      res.status(422)
      return next(
        new Exception(
          'Invalid request',
          ErrorCodes.REQUIRED
        )
      )
    }

    if (!name || !email || !phone) {
      res.status(422)
      return next(
        new Exception(
          'Name and email is required',
          ErrorCodes.REQUIRED
        )
      )
    }

    if (!Validator.email(email)) {
      res.status(422)
      return next(
        new Exception(
          'Please provide a valid email',
          ErrorCodes.REQUIRED
        )
      )
    }


    if (!subject || !message) {
      res.status(422)
      return next(
        new Exception(
          'Subject and Message is required',
          ErrorCodes.REQUIRED
        )
      )
    }

    await AgentMessage.create({ name, email, subject, message, phone }).then()

    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.AGENT_CONTACT,
        reciever: _agent.email,
        subject: subject,
        locals: { name: name, phone, message, userEmail: email },
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )

    res.json({ message: `Thank you for contacting ${_agent.firstName || ''} ${_agent.lastName || ''} us, your message will be attended to appropriately` })


  }


  async offshore(req, res, next) {
    const { firstName,
      lastName,
      email,
      phone,
      city,
      state,
      zipcode,
      businessSize,
      staffNeeded,
      hireUrgency,
      message,
      preferredContact } = req.body

    if (!firstName) {
      res.status(422)
      return next(
        new Exception(
          'firstName is required',
          ErrorCodes.REQUIRED
        )
      )
    }



    await Offshore.create({
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      zipcode,
      businessSize,
      staffNeeded,
      hireUrgency,
      message,
      preferredContact
    }).then()

    res.json({ message: 'Your request has been submitted, your message will be attended to appropriately' })


  }


  /**
   * subscribe a user to mailing list
   * @param  {Express.Request} req
   * @param  {Express.Response} res
   * @param  {Function} next
   */
  subscribe = async (req, res, next) => {
    const { email } = req.body

    if (!Validator.email(email))
      return next(
        new Exception(
          "Please provide a valid email",
          ErrorCodes.INCORRECT_PASSWORD
        )
      )


    EmailList.findOneAndUpdate({ email }, { unsubscribed: false }, { upsert: true }).exec()


    res.json({
      data: {
        message: `${email} has been subscribed to Enrolled Agents mailing list`,
      },
    })
  }

  /**
* usubscribe a user to mailing list
* @param  {Express.Request} req
* @param  {Express.Response} res
* @param  {Function} next
*/
  unsubscribe = async (req, res, next) => {
    const { email } = req.query
    const e = await EmailList.findOneAndUpdate({ email }, { unsubscribed: true }).exec()
    if (e)
      req.app.locals.message = `${email} has been unsubscribed from recieving mails from Enrolled Agents`;

    res.redirect('/')
  }




}

module.exports = new ContactController()