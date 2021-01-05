const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const args = require('./commands');

const { Middleware, Models: { User, AdminUser } } = require("common");



const city = require("./seed/city");
const agent = require("./seed/agent");
const index = require("./seed/manageIndex");
const user = require("./seed/user");
const { exit } = require('process');


// initialize mongodb
Middleware.MongoConnection;
try {


    if (args.city)
        city()
    else if (args.agent)
        agent()
    else if (args.index)
        index()
    else if (args.user)
        user(User, args.user)
    else if (args.admin)
        user(AdminUser, args.admin)
    else {
        console.log('Please specify parameters')
        exit(0)
    }
} catch (error) {
    console.error(error)
    exit(0)
}