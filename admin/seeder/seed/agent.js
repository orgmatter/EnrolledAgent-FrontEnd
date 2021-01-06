const { Models: { Agent, State, City }, CSVParser, Helper } = require('common')
const CITY = require('../data/cities.json')
const args = require('../commands');
const STATES = require('../data/states.json');
const {createAgent} = require('../../lib/agentUtils');
const agent = require('common/lib/models/agent');
const { exit } = require('process');




const createAgentS = async (done) => {
    if (process.env.NODE_ENV == 'production') {
        console.log('you cannot run this command in production')
        exit(0)
    }
    const start = new Date()
    let delEnd, end, parseEnd
    await Agent.deleteMany({}).exec()
    delEnd = new Date()

    CSVParser.parse(args.a, async (err, data) => {
        parseEnd = new Date()
        if (err) {
            console.log('parsing csv returned an error', err)
            exit(0)
        }
        // console.log(data)
        for (let index = 0; index < data.length; index++) {
            const agent = data[index];
            console.log('creating  agent', index)
            await createAgent(agent)
            console.log('sleeping for 10 milliseconds')
            await Helper.delay(10)

        }

        end = new Date()
        console.log('Generated agents sucessfully', '\n', 'started at: ', start)
        console.log('deleted all agents at: ', delEnd)
        console.log('parsed csv at: ', parseEnd)
        console.log('created all agents at: ', end)
        console.log('completed process in  ', ((end - start).valueOf() * .0001), 'seconds')
        exit(0)
    })
}


module.exports = async () => {
    await createAgentS(() => console.log('Created Cities'))
}