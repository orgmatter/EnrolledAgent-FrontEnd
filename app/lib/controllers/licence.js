const {
    Exception,
    ErrorCodes, 
    Validator, 
    MailService, EmailTemplates,
    Models: { LicenseVerification, },
} = require("common");
const Payment = require("payment_module");

const BaseController = require("../controllers/baseController");


class LicenceController extends BaseController {

    async create(req, res, next) {
        const { firstName,
            lastName,
            email,
            phone,
            city,
            state,
            zipcode,
            firmName,
            agentFirstName,
            agentLastName,
            agentCity,
            agentZipcode,
            agentPhone,
            agentEmail,
            agentstate,
            licence,
            message,
            preferredContact } = req.body

        if (!firstName || !lastName || !email) {
            res.status(422)
            return next(
                new Exception(
                    'firstName is required',
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

        await LicenseVerification.create({
            firstName,
            lastName,
            email,
            phone,
            city,
            state,
            zipcode,
            firmName,
            agentEmail,
            agentFirstName,
            agentLastName,
            agentCity,
            agentZipcode,
            agentPhone,
            agentstate,
            licence,
            message,
            preferredContact
        }).then((doc)=> {
            Payment.init('licence',  { licence: doc._id, email }, )
            .then((result) => res.json(result))
            .catch((err) => next(err))
        })

        new MailService().sendMail(
            {
              // secret: config.PUB_SUB_SECRET,
              template: EmailTemplates.INFO,
              reciever: process.env.DEFAULT_EMAIL_SENDER,
              subject: 'Licence Verification',
              locals: { message: `
              <p>Hello Admin,  </p>
              <p>A new licence verification request has been sent, below is a summary.</p><br>
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

        // res.json({ message: 'Your request has been submitted, your message will be attended to appropriately' })


    }


}

module.exports = new LicenceController();

