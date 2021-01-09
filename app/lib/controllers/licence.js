const {
    Exception,
    ErrorCodes, 
    Validator, 
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

        // res.json({ message: 'Your request has been submitted, your message will be attended to appropriately' })


    }


}

module.exports = new LicenceController();

