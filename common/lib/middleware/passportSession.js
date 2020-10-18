// const passport = require('passport');


// const User = require('../models/userModel');

// const validators = require('../utils/validators');

// module.exports = function passportConfig(app) {
//   app.use(passport.initialize());
//   app.use(passport.session());
//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });

//   passport.deserializeUser((id, done) => {
//     User.findOne({
//       _id: id
//     }, { password: 0, salt: 0 }, (err, user) => {
//       done(err, user);
//     });
//   });


// };
