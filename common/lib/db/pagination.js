const async = require('async')
const mongoose  = require('mongoose')

/**
 *
 * @param  {Express.Response} res
 * @param  {Function} next
 * @param  {mongoose.Collection} Collection
 * @param {JSON}  options - { perPage, page, query, progections}
 */
module.exports = async (res, next, Collection, options, done) => {
  const {
    page,
    perPage,
    query,
    projections,
    sort,
    populate
  } = options
  const p = Number(page) || 1
  const pp = Number(perPage) || 10
  // const pop = populate || []

  const countAll = (callback) =>
    Collection.estimatedDocumentCount(query)
        .then((doc) => callback(null, doc))
        // .catch((err) => callback(err, null))

  const findQuery = (callback) =>
    Collection.find(query, projections)
        .skip(pp * (p - 1))
        .limit(pp)
        .sort(sort)
        .populate(populate)
        .exec()
        .then((doc) => callback(null, doc))
        // .catch((err) => callback(err, null))

  async.parallel([countAll, findQuery], (err, doc) => {
    if (err) return next(err)
    const pages = Math.ceil(doc[0] / pp)
    const total = doc[0]
    // console.log(doc[1])

    done({
      data: doc[1],
      pages,
      prev: p > 1,
      next: p < pages && pages > 0,
      total,
      page: p,
      status: err == null ? 'success' : 'error'
    })
  })
}
