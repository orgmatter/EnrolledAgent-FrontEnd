const {today} = require('../utils/helper')
const {Analytics, Click, View} = require('../models')

/**
 * increment page view count for company page
 * @param  {String} id - company id
 */
const updateCount = async (id) => {
  const query = { ...today(), company: id }
  if (await Analytics.exists(query))
    Analytics.findOneAndUpdate(query, {
      $inc: { count: 1 }})
    // }).then((response) => console.log(response))
  .exec()
  else
    Analytics.create({ ...query, count: 1 })
    .then();
  // .exec()
}

/**
 * increment  count for advert 
 * @param  {String} id - company id
 */
exports.incClick = async (id) => {
  const query = { ...today(), sub: id }
  if (await Click.exists(query))
    Click.findOneAndUpdate(query, {
      $inc: { count: 1 }})
    // }).then((response) => console.log(response))
  .exec()
  else
  Click.create({ ...query, count: 1 })
    .then();
  // .exec()
}


/**
 * increment  view for advert 
 * @param  {String} id - company id
 */
exports.incView = async (id) => {
  const query = { ...today(), sub: id }
  if (await View.exists(query))
    View.findOneAndUpdate(query, {
      $inc: { count: 1 }})
    // }).then((response) => console.log(response))
  .exec()
  else
  View.create({ ...query, count: 1 })
    .then();
  // .exec()
}


/**
 * checks if user has visited this page today, and updates the count
 * @param  {String} id - company id
 * @param  {Express.Request} req -
 * @param  {Function} next - callback function
 */
exports.analytics = (id, req) => {
  const t = today()
  console.log(t, req.session)
  let { pageViews } = req.session
  // console.log(pageViews.date, t)
  if (
    !pageViews ||
    !pageViews.date ||
    pageViews.date.year != t.year ||
    pageViews.date.month != t.month ||
    pageViews.date.day != t.day
  )
    pageViews = { date: t, pages: [String(id)] }
  else {
    // pageViews = { date: t, pages: [String(id)] }
    // console.log('else', pageViews.pages.includes(id))
    if (!pageViews.pages.includes(String(id))) pageViews.pages.push(String(id))
    else return
  }
  pageViews.pages = [...new Set(pageViews.pages)]
  req.session.pageViews = pageViews
  // console.log(t, req.session)
  updateCount(id)
}
