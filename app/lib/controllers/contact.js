const {
  Exception,
  ErrorCodes,
  FileManager,
  Storages,
  MailService, EmailTemplates,
  Validator,
  Helper,
  DB,
  Models: { Contact, PartnerRequest, AgentMessage, Agent, AdminUser, EmailList, Offshore },
} = require("common")
const { Types: { ObjectId } } = require("mongoose")


class ContactController {

  async create(req, res, next) {
    const { name, email, subject, message, phone } = req.body

    if (!name || !email ) {
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


   
    res.json({ message: 'Thank you for contacting us, your message will be attended to appropriately' })

      new MailService().sendMail(
        {
          // secret: config.PUB_SUB_SECRET,
          template: EmailTemplates.CONTACT,
          reciever: process.env.DEFAULT_EMAIL_SENDER,
          subject: subject,
          locals: { name: name, phone, message, userEmail: email },
        },
        (res) => {
          if (res == null) return
          log.error("Error sending mail", res)
        }
      )

      new MailService().sendMail(
        {
          // secret: config.PUB_SUB_SECRET,
          template: EmailTemplates.INFO,
          reciever: email,
          subject: subject,
          locals: { message: `
          <p>Thank you for contacting, EnrolledAgent.com</p>
          <p>We have received your message, it will be attended to appropriately</p>`},
        },
        (res) => {
          if (res == null) return
          log.error("Error sending mail", res)
        }
      )
    



  }

  async partner(req, res, next) {
    const { name, firm, email, message, phone } = req.body

    if (!name || !email ) {
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


    

    await PartnerRequest.create({ name, firm,  email, message, phone }).then()


   
    res.json({ message: 'Thank you for contacting us, your message will be attended to appropriately' })

      new MailService().sendMail(
        {
          // secret: config.PUB_SUB_SECRET,
          template: EmailTemplates.INFO,
          reciever: process.env.DEFAULT_EMAIL_SENDER,
          subject: 'Parter Request',
          locals: { message: `
          <p>A user has indicated interest in becoming a partner with EnrolledAgent.com, below is a summary.</p><br>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Info: ${message}</p>`
        },
        },
        (res) => {
          if (res == null) return
          log.error("Error sending mail", res)
        }
      )

      new MailService().sendMail(
        {
          // secret: config.PUB_SUB_SECRET,
          template: EmailTemplates.INFO,
          reciever: email,
          subject: "EnrolledAgent",
          locals: { message: `
          <p>Thank you for your interest in becoming a partner with EnrolledAgent.com</p>
          <p>We will get in touch with you as soon as possible</p>`},
        },
        (res) => {
          if (res == null) return
          log.error("Error sending mail", res)
        }
      )



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

    if (!name || !email ) {
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

    await AgentMessage.create({ name, email, subject, message, phone, agent }).then()
    res.json({ message: `Thank you for contacting ${_agent.firstName || ''} ${_agent.lastName || ''}, your message will be attended to appropriately` })

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
    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.INFO,
        reciever: process.env.DEFAULT_EMAIL_SENDER,
        subject: subject,
        locals: { message: `
        <p>Thank you for contacting ${_agent.firstName || ''} ${_agent.lastName || ''} </p>
        <p>your message will be attended to appropriately</p>`},
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )



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

    new MailService().sendMail(
      {
        // secret: config.PUB_SUB_SECRET,
        template: EmailTemplates.INFO,
        reciever: process.env.DEFAULT_EMAIL_SENDER,
        subject: 'Offshore Request',
        locals: { message: `
        <p>Hello Admin,  </p>
        <p>A new offshore request has been sent, below is a summary.</p><br>
        <p>Name: ${firstName, lastName}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Zipcode: ${zipcode}</p>
        <p>Message: ${message}</p>
        <p></p>
        `},
      },
      (res) => {
        if (res == null) return
        log.error("Error sending mail", res)
      }
    )


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
    const e = await EmailList.findOneAndUpdate({ email }, { unsubscribed: true }, {upsert: true, new: true}).exec()
    if (e)
      req.session.message = `${email} has been unsubscribed from recieving mails from Enrolled Agents`;

    res.redirect('/')
  }




}

module.exports = new ContactController()