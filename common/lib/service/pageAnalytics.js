const { today } = require('../utils/helper')
const { PageView } = require('../models')

class PageAnalyticsService {

  /**
   * increment page view count for a page
   * @param  {String} page  
   */
  static inc = async (page) => {
    const query = { ...today(), page }
    PageView.findOneAndUpdate(query, {
      $inc: { count: 1 }
    }, { upsert: true })
      .exec()
  }

  // exports.analytics = (id, req) => {
  //   const t = today()
  //   console.log(t, req.session)
  //   let { pageViews } = req.session
  //   // console.log(pageViews.date, t)
  //   if (
  //     !pageViews ||
  //     !pageViews.date ||
  //     pageViews.date.year != t.year ||
  //     pageViews.date.month != t.month ||
  //     pageViews.date.day != t.day
  //   )
  //     pageViews = { date: t, pages: [String(id)] }
  //   else {
  //     // pageViews = { date: t, pages: [String(id)] }
  //     // console.log('else', pageViews.pages.includes(id))
  //     if (!pageViews.pages.includes(String(id))) pageViews.pages.push(String(id))
  //     else return
  //   }
  //   pageViews.pages = [...new Set(pageViews.pages)]
  //   req.session.pageViews = pageViews
  //   // console.log(t, req.session)
  //   updateCount(id)
  // }
}

module.exports = PageAnalyticsService