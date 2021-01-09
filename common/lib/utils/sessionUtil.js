const session = require('express-session')
const redis = require('redis')
const uuid = require('uuid/v4')

const domain = process.env.DOMAIN
const RedisStore = require('connect-redis')(session)

const client = redis.createClient()
const redisConfig = {
  host: 'localhost',
  port: 6379,
  client
}

const hour = 3600000
class SessionUtil {
  constructor() {
    this.secret = process.env.SECRET
    this.store = new RedisStore(redisConfig)
  }

  get newSession() {
    return session({
      genid: () => uuid(),
      store: this.store,
      secret: this.secret,
      resave: true,
      cookie: { maxAge: hour * 24 * 2, },
      saveUninitialized: true
    })
  }
}

module.exports = new SessionUtil()
