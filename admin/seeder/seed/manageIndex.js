const { Models } = require('common');
const { exit } = require('yargs');
const args = require('../commands');

module.exports = async () => {
    let count = 0
    const models = String(args.index).split(',')
    if (models && models.length > 0) {
        await models.forEach((model, index) => {
            // console.log(args, models, Models[model])
            const Model = Models[model]
            if (Model && Model.collection)
                Model.collection.dropIndexes(function (error, results) {
                    console.log('Dropped index :', Model, 'error', error, 'results', results)
                    console.log()
                    Model.createIndexes(function (error, results) {
                        console.log('Created index :', Model, 'error', error, 'results', results)
                        console.log('error', error)
                        console.log('results', results)
                        count++
                        if (count == models.length) exit(0)
                    });
                });
             else {
                console.log('Model ', model, 'not found')
                count ++ 
                if (count == models.length) exit(0)
             }   

        });
    } else {
        console.log('Model ', args.index, 'not found')
        exit(0)
    }
}