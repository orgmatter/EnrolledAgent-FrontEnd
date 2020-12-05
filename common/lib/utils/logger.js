const Chalk = require('chalk')
const debug = require('debug')

/**
 * logging utility
 */
class Logger {
  /**
   * @param  {string} namespace
   */
  constructor(namespace) {
    this.debug = debug(`porple:${namespace}`)
    this.isDebugMode = process.env.NODE_ENV !== 'production'
  }
  /**
   * @param  {string} message
   * info level message
   */
  info(message, args) {
    if (!this.isDebugMode) return
    if (typeof message == 'object') message = JSON.stringify(message)
    console.debug(`${Chalk.green('INFO')}: ${message}`, args)

    this.debug(`${Chalk.green('INFO')}: ${message}`, args)
  }
  /**
   * @param  {string} message - error message
   * @param  {object} stacktrace - the stacktrace of the error
   */
  error(message, stacktrace) {
    if (!this.isDebugMode) return
    this.debug(`${Chalk.red('ERROR:')} ${message}`)
    if (stacktrace) {
      debug(
          `${Chalk.red('STACK_TRACE:')} ${JSON.stringify(stacktrace)}`
      )
    }
  }
  /**
   * @param  {string} message - warning message
   */
  warning(message) {
    if (!this.isDebugMode) return
    this.debug(`${Chalk.yellow('WARNING:')} ${message}`)
  }
}

module.exports = Logger
