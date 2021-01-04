const { Models } = require('common');
const { exit } = require('yargs');
const args = require('../commands');

module.exports = async () => {
    let count = 0
    let models = []
    if (args.index == 'all') {
        console.log('recreating all indexes')
        for (const model in Models) {
            if (Models.hasOwnProperty(model)) {
                const Model = Models[model]
                if (Model.collection) models.push(Model)
            }
        }
    } else {
        const m = String(args.index).split(',')
        if (m && m.length > 0) {
            for (const model in m) {
                if (Models.hasOwnProperty(model)) {
                    const Model = Models[model]
                    if (Model.collection) models.push(Model)
                }
            }
        } else {
            console.log('Model ', args.index, 'not found')
            exit(0)
        }
    }

    if (models && models.length > 0) {
        await models.forEach((Model, index) => {
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
        });
    } else {
        console.log('Model ', args.index, 'not found')
        exit(0)
    }
}