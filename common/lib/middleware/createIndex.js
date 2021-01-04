const Models = require('../models')
const Helper = require('../utils/helper')

module.exports =
    new Promise(async (resolve, reject) => {
        for (const model in Models) {
            if (Models.hasOwnProperty(model)) {
                const Model = Models[model]
                // if (Model.syncIndexes)
                    Model.syncIndexes()
                        .then(resolve)
                        .catch(reject)
                    await  Helper.delay(2000)
            }
        }
    })
