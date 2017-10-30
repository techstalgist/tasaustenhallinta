const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const jwtOptions = require('./jwt');
const UserDao = require('../user-dao');

let strategy = new JwtStrategy(jwtOptions, (payload, done) => {
  UserDao.findById(payload.id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) { return done(null, user); }
    done(null, false);
  });
});

passport.use(strategy);

module.exports = passport;
