const { Models: { Agent, City, State, }, DB, Logger, Helper } = require('common')
const CITY = require('../data/cities.json')
const STATES = require('../data/states.json')
const STATE_LIST = require('../data/statesList.json')
const args = require('../commands');


const log = new Logger('seeder')


const createCity = async (agent) => {
    try {
        console.log('create city ')
        await City.findOneAndUpdate({
            name: agent.city
        }, {
            name: agent.city,
            abbreviation: agent.stateCode,
            state: STATES[agent.stateCode],
        }, { upsert: true }).exec()
    } catch (error) {
        console.log(error)
    }
}

const createState = async (agent) => {
    console.log('create state ')
    const name = STATES[agent.stateCode]
    try {
        await State.findOneAndUpdate({
            abbreviation: agent.stateCode
        }, {
            name,
            abbreviation: agent.stateCode
        }, { upsert: true }).exec()

    } catch (error) {
        console.log(error)
    }

}

/**
   * get adverts
   * @param  {Number} page
   * @param  {Number} perPage
   * @param  {object} query
   * @param  {function} done
   */
const getAgents = async (page = 1, perPage = 1000, query, done) => {
    DB.Paginate({}, done, Agent, {
        perPage,
        query,
        page,
        projections: {
            state: 1,
            city: 1,
            stateCode: 1
        },
    }, (res) => done(null, res))
}



/**
     * for every agent compute rating
     * @param {Number} page
     * @param {function} done
     */
const runJob = async (page = 1, done) => {
    getAgents(
        page,
        1000,
        {},
        async (err, result) => {
            // console.log(err, result)
            if (err) {
                console.log(err)
                done(err)
            } else {
                const { data, pages, page } = result
                for (let index = 0; index < data.length; index++) {
                    const agent = data[index]

                    if (agent && agent.state) {
                        // console.log(agent)
                        await createCity(agent)
                        await createState(agent)
                    }
                }
                await Helper.delay(500)
                if (pages > page) {
                    console.log('running job again', page)
                    runJob(page + 1, done)
                } else done()
            }
        }
    )
}

module.exports = async () => {
    await City.deleteMany({}).exec()
    await State.deleteMany({}).exec()

    runJob(1, () => console.log('Created States and cities'))

    // await createStates(() => console.log('Created States'))
    // await createCities(() => console.log('Created Cities'))
}