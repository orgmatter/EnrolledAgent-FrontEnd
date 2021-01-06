const express = require("express");
const { Middleware, Models } = require("common");


// initialize mongodb
Middleware.MongoConnection;
Middleware.createIndex
    .then(console.log)
    .catch(console.log)

const server = express();

Middleware.api(server)
// Passport(server, passport, Constants.DOMAIN.admin);
server.use(express.raw())
server.use(Middleware.guard)

server.use(require("./routes"))

// extract and verify the token

module.exports = server;
