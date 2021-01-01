const { Models: { AdminUser, User, Agent, City, State, Sponsor, Resource, Article, ResourceCategory }, Validator, Logger, Helper } = require('common')
const CITY = require('../data/cities.json')
const STATES = require('../data/states.json')
const STATE_LIST = require('../data/statesList.json')
const args = require('../commands');


const log = new Logger('seeder') 


const createStates = async (done) => {
    await State.deleteMany({},).exec()

    for (const state of STATE_LIST) {
        await State.create({
            name: state.name,
            abbreviation: state.abbreviation
        })
        console.log(state)
    }
    done()



}

const createCities = async (done) => {
    await City.deleteMany({}).exec()

    for (const { city, state } of CITY) {
        await City.create({
            name: city,
            abbreviation: state.abbreviation,
            state,
        })
        console.log(state, city)
    }
    done()
}


module.exports = async () => {
    await createStates(() => console.log('Created States'))
    await createCities(() => console.log('Created Cities'))
}