const express = require("express");
const passport = require("passport");
const { Middleware, Passport, Constants } = require("common");
const path = require("path");
const sassMiddleware = require("node-sass-middleware");
// initialize mongodb
Middleware.MongoConnection;

const views = path.join(__dirname, "../views");
const publicDir = path.join(__dirname, "../../public");
const sassDir = path.join(__dirname, "../sass");

const server = express();
// adding the sass middleware
server.use(
  sassMiddleware({
    src: path.join(__dirname, "../sass"),
    dest: path.join(__dirname, "../../public"),
    debug: true,
    outputStyle: "compressed",
  })
);
server.use(express.static(path.join(__dirname, "../../public")));

Middleware.app(server, views);
Passport(server, passport, Constants.DOMAIN.user);

const router = require("./routes");

server.use(router);

module.exports = server;
