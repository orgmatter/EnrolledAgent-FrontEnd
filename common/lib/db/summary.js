const async = require('async')

/**
 * get summary count and id strings
 * @param  {Express.Response} res
 * @param  {function} next
 * @param  {mongoose.Collection} Collection
 * @param {object}  options - { perPage, page, query, progections}
 */
module.exports = async (res, next, Collection, options) => {
  const {
    query,
    projections,
    unwrap
  } = options

  const countAll = (callback) =>
    Collection.countDocuments(query)
        .then((doc) => callback(null, doc))
        .catch((err) => callback(err, null))

  const findQuery = (callback) =>
    Collection.find(query, projections)
        .exec()
        .then((doc) => callback(null, doc))
        .catch((err) => callback(err, null))

  async.parallel([countAll, findQuery], (err, doc) => {
    if (err) return next(err)
    const count = doc[0]
    const r = doc[1]
    const items = []
    r.forEach((d) => {
      items.push(d[unwrap])
    })

    res.json({
      data: {count, items}
    })
  })
}
