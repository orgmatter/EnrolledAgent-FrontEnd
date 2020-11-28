const express = require("express");
const passport = require("passport");
const { Middleware, Passport } = require("common");
const path = require("path");
// initialize mongodb
Middleware.MongoConnection;


const server = express();

Middleware.app(server, path.join(__dirname, "../views"));
Passport(server, passport);

const router = require("./routes");

server.use(router);

module.exports = server;
