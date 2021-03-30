const { Strategy } = require('passport-local');
const User = require('../models/user.model');

/**
 * Initialize passport config
 * @param {import('passport')} passport
 */
const init = (passport) => {
  const localStrategy = new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  );

  passport.use(localStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    // try {
    //   const user = await User.findById(_id);

    //   done(null, user);
    // } catch (error) {
    //   done(error, false);
    // }
    done(null, user);
  });
};

module.exports = init;
