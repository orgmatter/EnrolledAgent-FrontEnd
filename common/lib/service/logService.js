 const Log = require('../models').Log

/**
 *Logs operations to the database
 */
class LogService {
  /**
   * @param  {object} data - log object
   */
  static save(data) {
    const log = new Log(data)
    log.save()
  }
}

module.exports = LogService
