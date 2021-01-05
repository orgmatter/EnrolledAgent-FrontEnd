const csv = require('csvtojson');
const path = require('path');
const fs = require('fs')
const Exception = require('../utils/exception')

module.exports = class CsvParser {
    static async parse(filePath, done) {
        const _file = path.parse(filePath)
        console.log(filePath, _file)
        if (_file.ext != '.csv') return done(new Exception('Please use a CSV File',))
        if (filePath && await fs.existsSync(filePath)) {
            const jsonArray = await csv().fromFile(filePath)
            done(null, jsonArray)
        } else done(new Exception('File not found'))
    }
}