const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')});
const args = require('./commands');

const { Middleware} = require("common");



const city = require("./seed/city");
 

// initialize mongodb
Middleware.MongoConnection;

if(args.city)
city()
// console.log('myArgs: ', args)