const PassportLocal = require("passport-local").Strategy;
const Admin = require("../models/adminModel");

module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) =>
    Admin.findById(id, (err, user) => done(err, user))
  );

  passport.use(
    "local-login",
    new PassportLocal((username, password, done) => {
      Admin.findOne({ username: username }, (err, admin) => {
        if (err) return done(err);
        if (!admin) return done(null, false);
        if (!admin.validatePassword(password, admin.password))
          return done(null, false);
        return done(null, admin);
      });
    })
  );
};
