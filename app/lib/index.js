const express = require('express');
const passport = require('passport')
const {Middleware, Passport, Constants} =  require('common');
const path =  require('path');
// initialize mongodb
Middleware.MongoConnection

const views = path.join(__dirname, '../views')

const server = express();


Middleware.app(server, views);
Passport(server, passport, Constants.DOMAIN.user  )

const router = require('./routes');

server.use(router);

module.exports = server;
