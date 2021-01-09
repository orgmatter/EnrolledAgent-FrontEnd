const { Validator, Helper } = require('common');
const { exit } = require('process'); 

const parse = (usr)=> {
    const user = Helper.parseQuery(usr)
    console.log(Validator.email(user.email))
    if(user && user.email && Validator.email(user.email))
    return user

    console.log('please provide a valid email', user.email, 'is invalid')
    console.log('required format is "email:user\'s email,firstName:user\'s firstname,lastName:user\'s lastname,password:user\'s password"')
    exit(0)
}

module.exports = async (Model, args) => {
    let {email, firstName, lastName, password} = parse(args) || {}
   
    if (!(await Model.exists({ email }))) {
        if(!password) password = 'Password2020'
        if(!firstName) firstName = 'Dummy'
        if(!lastName) lastName = 'Dummy'
        Model.create({ email, lastName, firstName, isEmailVerified: true })
            .then(async (user) => {
                await user.setPassword(password)
                await user.save() 
                console.log('user created', Helper.userToSession(user), 'password:', password)
                exit(0)
            })

    } else {
        console.log('User with email', email, 'Already exists')
        exit(0)
    }
} 