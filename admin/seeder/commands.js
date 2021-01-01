const yargs = require('yargs');
const argv = yargs
    .command('lyr', 'Tells whether an year is leap year or not', {
        year: {
            description: 'the year to check for',
            alias: 'y',
            type: 'number',
        }
    })
    .option('city', {
        alias: 'c',
        description: 'Delete all cities and state and re-seed them',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

 module.exports = argv   