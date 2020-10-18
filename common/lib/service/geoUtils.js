const geoip = require('geoip-lite')
const Helper = require('../utils/helper')
const Locale = require('../models/locale')

// var ip = "207.97.227.239";
// var geo = geoip.lookup(ip);

// console.log(geo);
// { range: [ 3479298048, 3479300095 ],
//   country: 'US',
//   region: 'TX',
//   eu: '0',
//   timezone: 'America/Chicago',
//   city: 'San Antonio',
//   ll: [ 29.4969, -98.4032 ],
//   metro: 641,
//   area: 1000 }
/**
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {Function} next
 */
module.exports = (req, res, next) => {
    // console.log(req)
  const ip = Helper.getIp(req)
  const locale = geoip.lookup(ip || '154.113.86.237')
  const l = new Locale(locale || {})
  req.locale = l
  // console.log(ip, req.locale, Locale(locale), locale)
  next()
}
