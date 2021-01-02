const yargs = require('yargs');
const argv = yargs
    .option('city', {
        alias: 'c',
        description: 'Delete all cities and state and re-seed them',
        type: 'boolean',
    })
    .option('agent', {
        alias: 'a',
        description: 'Delete all agents and re-seed them, this requires the full path to csv file',
        type: 'string',
    })
    .option('index', {
        alias: 'i',
        description: 'Delete and recreate indexes, enter Model name separated by comma',
        type: 'string',
    })
    .option('user', {
        alias: 'u',
        description: 'create a user account, \n format is `email:user\'s email,firstName:user\'s firstname,lastName:user\'s lastname,password:user\'s password`, \n only email is required',
        type: 'string',
    })
    .option('admin', {
        alias: 'd',
        description: 'create a user account, \n format is `email:user\'s email, firstName:user\'s firstname,lastName:user\'s lastname,password:user\'s password`, \n only email is required',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

module.exports = argv   