const express = require("express");
const passport = require("passport");
const { Middleware, Passport, Constants } = require("common");
const path = require("path");

// initialize mongodb
Middleware.MongoConnection;

const views = path.join(__dirname, "../views");

const server = express();

Middleware.app(server, views);
Passport(server, passport, Constants.DOMAIN.admin);

server.use(express.static(path.join(__dirname, "../../public")));
server.use(require("./routes"));

module.exports = server;
