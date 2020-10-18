const {Models:{AdminUser, User}, Validator, Logger} = require('common')

const seedUsers = process.env.SEED_USERS
const seedAdmin = process.env.SEED_ADMIN

const log = new Logger('seeder')

const createAdmin = async (email) => {
    if(!(await AdminUser.exists({email})))
    AdminUser.create({email, accountType: 'ADMIN', name: 'Admin', isEmailVerified: true, status: 'super_admin'})
    .then((user)=>{
        user.setPassword('Password2020')
        user.save()
        console.log(email, 'user created')
    })
}


const createUser = async (email) => {
    if(!(await User.exists({email})))
    AdminUser.create({email, accountType: 'USER', name: 'Admin', isEmailVerified: true, status: 'super_admin'})
    .then((user)=>{
        user.setPassword('Password2020')
        user.save()
        console.log(email, 'user created')
    })
}

module.exports = async ()=> {
    let usr = String(seedUsers)
    if(usr) {
        usr.split(',').forEach(u => {
            if(Validator.email(u))
            createUser(u)
        })
    }

    let admin = String(seedAdmin)
    if(usr) {
        admin.split(',').forEach(u => {
            if(Validator.email(u))
            createUser(u)
        })
    }

    
}