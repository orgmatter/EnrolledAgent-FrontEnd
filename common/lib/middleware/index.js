module.exports = {
  ErrorHandler: require('./errorHandler'),
  Four04Handler: require('./404Handler'),
  MongoConnection: require('./mongoConnection'),
  api: require('./apiMiddleware'),
  app: require('./appMiddleware'),
  guard: require('./apiGuard'),
  createIndex: require('./createIndex'),
  ExtractToken: require('./extractToken'),
  StoreAuth: require('./storeAuth'),
  Socket: require('./socket')
}
