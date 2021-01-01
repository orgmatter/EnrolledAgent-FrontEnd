const { DB,  Models: { City, State } } = require("common")

/**
* Manage cities
*/
class CityController {

    /**
    * update a user record, if a file was uploaded,
    * it saves the file to storge
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
    async get(req, _, next) {
        const city = await City.find({})
            .limit(64)
            .sort({ count: -1 })
            .exec()
        req.locals.cities = city
        next()
    }

     /**
    * get all states
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
   async allStates(req, _, next) {
    const state = await State.find({}, { name: 1, slug: 1 })
        .sort({ count: -1 })
        .exec()
    req.locals.states = state
    next()
}


/**
    * update a user record, if a file was uploaded,
    * it saves the file to storge
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
   async forState(req, res, next) {
    const { query: { page}, params: { state } } = req
    const query ={stateSlug: state}

    DB.Paginate(res, next, City, {
        perPage: 45,
        query,
        page,
        sort: { count: -1 },
        populate: [{ path: 'reviewCount', select: ['rating'] }, { path: 'owner', select: ['_id', 'firstName'] }]
    }, (data) => {
        req.locals.cities = data
        next()
    })
}


   /**
    * get state
    * @param  {Express.Request} req
    * @param  {Express.Response} res
    * @param  {function} next
    */
   async state(req, res, next) {
    const {   params: {state} } = req
     

    const _city = await State.findOne({slug: { $regex : new RegExp(state, "i") }})

    if(!_city) return res.redirect('/agents/all-states')
    req.locals.state = _city
    next()
    State.findByIdAndUpdate(_city._id,  { $inc: { count: 1 } }).exec()

}


}

module.exports = new CityController()