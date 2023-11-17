const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const Users = require('../models/user')

// set up passport strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    const user = await Users.findOne({ email })
    if (!user) {
      return done(null, false)
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return done(null, false)
    }

    return done(null, user)
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await Users.findById(id)
  done(null, user)
})

module.exports = passport
