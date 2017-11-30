const passportJwt = require('passport-jwt');
const ExtractJwt  = passportJwt.ExtractJwt;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
console.log(process.env.JWT_SECRET);
jwtOptions.secretOrKey = process.env.JWT_SECRET;

module.exports = jwtOptions;
