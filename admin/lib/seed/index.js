const { Models: { AdminUser, User, Agent, City, Sponsor }, Validator, Logger } = require('common')
const { Resource, Article } = require('common/lib/models')
const agents = require('./agents')

const seedUsers = process.env.SEED_USERS
const seedAdmin = process.env.SEED_ADMIN
const Agents = require('./agents')
const States = require('./states.json')
const Resources = require('./resource')
const Articles = require('./article')
const log = new Logger('seeder')

const createAdmin = async (email) => {
    if (!(await AdminUser.exists({ email })))
        AdminUser.create({ email, accountType: 'ADMIN', name: 'Admin', isEmailVerified: true, status: 'super_admin' })
            .then((user) => {
                user.setPassword('Password2020')
                user.save()
                console.log(email, 'user created')
            })
}

const createResource = async (resource) => {

    const sponsor = await Sponsor.findOneAndUpdate({ name: 'Dummy sponsor' },
        {
            name: 'Dummy sponsor', imageUrl: 'https://cpadirectory.nyc3.cdn.digitaloceanspaces.com/public/admin_uploads/resources/83/main-image/83_1607096042.jpg',
            link: 'https://google.com'
        }, { upsert: true }).exec()

    console.log(sponsor)

    resource.sponsor = sponsor._id

    Resource.create(resource)
        .then()
}


const createArticle = async (article) => {
    Article.create(article)
        .then(console.log)
}


const createUser = async (email) => {
    if (!(await User.exists({ email })))
        AdminUser.create({ email, accountType: 'USER', name: 'Admin', isEmailVerified: true, status: 'super_admin' })
            .then((user) => {
                user.setPassword('Password2020')
                user.save()
                console.log(email, 'user created')
            })
}


const createAgents = async () => {

    if (await Agent.estimatedDocumentCount() < 10) {
        Agents.forEach(async ({ First,
            Last,
            Address1,
            Address2,
            Address3,
            city,
            State,
            Zipcode,
            Country,
            Phone } = agent, index) => {
            const c = city.toLocaleLowerCase().trim()
            City.findOneAndUpdate({ name: c }, { name: c, count: 0 }, { upsert: true }, function (err, doc) {
                console.log(c, 'created')
            });

            let s = State
            const _s = States[s]
            s = _s || s
            await Agent.create(
                {
                    firstName: First, lastName: Last, city, state: s,
                    zipcode: Zipcode, country: Country, phone: Phone,
                    address1: Address1,
                    address2: Address2,
                    address3: Address3,
                })
                .then((a) => {

                    console.log(a, 'Agent created')
                })
        })
    }

}

module.exports = async () => {
    let usr = String(seedUsers)
    if (usr) {
        usr.split(',').forEach(u => {
            if (Validator.email(u))
                createUser(u)
        })
    }

    let admin = String(seedAdmin)
    if (usr) {
        admin.split(',').forEach(u => {
            if (Validator.email(u))
                createAdmin(u)
        })
    }
    if (Agents != null)
        createAgents();

    if (await Resource.estimatedDocumentCount({}) < 4) {
        Resources.forEach(r => createResource(r))
    }

    if (await Article.estimatedDocumentCount({}) < 4) {
        Articles.forEach(r => createArticle(r))
    }


}