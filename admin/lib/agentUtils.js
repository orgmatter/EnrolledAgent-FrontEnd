
const { Models: { Agent, State, City }, CSVParser, Helper } = require('common')

const STATES = require('../seeder/data/states.json');

const getStates = async (state) => {
    const result = new Promise(
        (resolve, reject) => {
            State.findOne({ abbreviation: state })
                .then(resolve)
                .catch(reject)
        }
    )
    return result;
}


/**
 * create agents from a list of agents parsed from CSV
 * @param  {[]} data
 */
exports.createAgent = async (data) => {
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
