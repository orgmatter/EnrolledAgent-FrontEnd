const { Models: { City } } = require("common")

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
        const city = await City.find({}, { name: 1 })
            .limit(64)
            .sort({ count: -1 })
            .exec()
        req.locals.city = city.map(c => c.name)
        next()
    }


}

module.exports = new CityController()