const JwtStrategy = require("passport-jwt").Strategy;
const dotenv = require("dotenv");
dotenv.config();
const cookieExtractor = function (req) {
  let token;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};
//opts.issuer = "accounts.examplesoft.com";
//opts.audience = "yoursite.net";
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (jwt_payload) {
        const user = jwt_payload.user;
        return done(null, user);
      }
      return done(null, false);
    })
  );
};
