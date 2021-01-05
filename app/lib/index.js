const express = require("express");
const passport = require("passport");
const { Middleware, Passport } = require("common");
const path = require("path");
// initialize mongodb
Middleware.MongoConnection;


const server = express();

Middleware.app(server, path.join(__dirname, "../views"));
Passport(server, passport);
<<<<<<< HEAD
server.use(express.static(path.join(__dirname,'../../public')))
=======
server.use(express.static(path.join(__dirname, '../../public')))
>>>>>>> 8d610b6523b7b2554f0554652a4df313bdb395c4
const router = require("./routes");

server.use(router);

module.exports = server;
