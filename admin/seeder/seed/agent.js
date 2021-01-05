const { Models: { Agent, State, City }, CSVParser, Helper } = require('common')
const CITY = require('../data/cities.json')
const args = require('../commands');
const STATES = require('../data/states.json');
const agent = require('common/lib/models/agent');
const { exit } = require('process');

const getStates = async (state) => {
    const result = new Promise(
        (resolve, reject) => {
            State.findOne({ abbreviation: state })
                .then(resolve)
                .catch(reject)
        }
    );



    return result;
}

const createAgent = async (data) => {
    const result = new Promise(
        async (resolve, reject) => {
            const {
                First,
                Last,
                Address1,
                Address2,
                Address3,
                city,
                State,
                Zipcode,
                Country,
                Phone } = data

            const _s = STATES[State] || State
            const state = await getStates(State) || {}

            const ag = {
                state: state.name || _s,
                stateCode: State,
                firstName: First, lastName: Last,
                city,
                zipcode: Zipcode, country: Country, phone: Phone,
                address1: Address1,
                address2: Address2,
                address3: Address3,
            }

            Agent.create(ag)
                .then((a) => {
                    console.log(a.firstName, 'Agent created')
                    resolve()
                })
                .catch(reject)
        })

    return result;
}


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