const {
    Exception,
    ErrorCodes,
    DB,
    Helper,
    Models: {Faq}
} = require("common");
const mongoose  = require('mongoose')

const BaseController = require('../controllers/baseController');

class FaqController extends BaseController {
 
    
     create = async (req, res, next)=> {
        const { title, message } = req.body

        console.log(req.body)

        if (!title || !message) {
            res.status(422)
            return next(
                new Exception(
                    'Faq title and message is required',
                    ErrorCodes.REQUIRED
                )
            )
        }
        

        const faq = await Faq.create({ title, message,  })

        super.handleResult(faq, res, next)

    }


     update = async (req, res, next)=> {
        const { body: { title, message }, params: { id } } = req
        if (!BaseController.checkId('Invalid faq id', req, res, next)) return

        const body = {'': ''}
        if (title)  body.title = title
        if (message) body.message = message

        let faq = await Faq.findByIdAndUpdate(id, body, { new: true })
        super.handleResult(faq, res, next)

    }


     delete = async (req, res, next) =>{
        const { id } = req.params
        if (!BaseController.checkId('Invalid faq id', req, res, next)) return

        let faq = await Faq.findByIdAndDelete(id).exec()
        super.handleResult(faq, res, next)
    }

     get = async (req, res, next) => {
        console.log(super.delete )
        const { id } = req.params

        if (!BaseController.checkId('Invalid faq id', req, res, next)) return
        let faq = await Faq.findById(id).exec()

        super.handleResult(faq, res, next)

    }

     getAll = async (req, res, next) =>{
        const { page, perpage, q, search } = req.query
        let query = Helper.parseQuery(q) || {}
        if (search) query = { title: { $regex: search, $options: 'i' } }

        DB.Paginate(res, next, Faq, {
            perPage: perpage,
            query,
            page,
        }, (data) => {
            super.handleResultPaginated({ ...data }, res, next)
        })

    }

}

module.exports = new FaqController