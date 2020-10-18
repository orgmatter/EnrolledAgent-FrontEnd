const NRP = require('node-redis-pubsub')
const redis = require('redis')

const redisPub = redis.createClient()
const redisSub = redis.createClient()

const config = {
  db: 12,
  port: 6379,
  host: 'localhost',
  emitter: redisPub,
  receiver: redisSub
}

module.exports = new NRP(config)
