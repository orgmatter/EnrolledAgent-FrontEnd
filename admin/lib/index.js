const express = require("express");
const passport = require("passport");
const { Middleware, Passport, Constants } = require("common");
const path = require("path");

// initialize mongodb
Middleware.MongoConnection;

const server = express();

Middleware.app(server, path.join(__dirname, "../views"));
Passport(server, passport, Constants.DOMAIN.admin);


server.use(require("./routes"));

module.exports = server;
