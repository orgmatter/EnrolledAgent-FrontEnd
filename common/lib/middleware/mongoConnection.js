const Log = require('../utils/logger')
const mongoose = require('mongoose')
const config = require('../config')

const log = new Log('common')
log.info(config.DB_URL, config.DB_OPTIONS)
log.info('connecting to mongo...')
const connectWithRetry = () =>
  mongoose.connect(config.DB_URL, config.DB_OPTIONS)

mongoose.connection.on('error', () => {
  connectWithRetry()
  console.log('Could not connect to MongoDB')
})

mongoose.connection.on('disconnected', () => {
  log.info('Lost MongoDB connection...')
  console.log('Lost MongoDB connection...')
  connectWithRetry()
})

mongoose.connection.on('connected', () =>
  console.log('Connection established to MongoDB')
)

mongoose.connection.on('reconnected', () =>
  console.log('Reconnected to MongoDB')
)

connectWithRetry()

