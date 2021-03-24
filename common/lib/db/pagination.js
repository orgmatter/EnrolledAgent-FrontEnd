const mongoose = require('mongoose')

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

  Promise.allSettled([
    Collection.countDocuments(query),
    Collection.find(query, projections)
      .skip(pp * (p - 1))
      .limit(pp)
      .sort(sort)
      .populate(populate)
      // .lean()
      .exec()]
  )
    .then(result => {

      const total = result[0].value || 0
      const pages = Math.ceil(total / pp)

      let status = 'success' 
      if(result[0].status == 'rejected' || result[1].status == 'rejected') status = 'error'


      done({
        data: result[1].value || [],
        pages,
        prev: p > 1,
        next: p < pages && pages > 0,
        total,
        page: p,
        perPage: pp,
        status
      })

    })
}
