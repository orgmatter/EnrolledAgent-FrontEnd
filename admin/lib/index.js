const express = require("express");
const { Middleware} = require("common");
 

// initialize mongodb
Middleware.MongoConnection;

const server = express();

Middleware.api(server);
// Passport(server, passport, Constants.DOMAIN.admin);
server.use(express.raw())

server.use(require("./routes"))

// extract and verify the token

module.exports = server;
