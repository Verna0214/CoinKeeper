const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')
const Users = require('../models/user')

// set up passport LocalStrategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    const user = await Users.findOne({ email })
    if (!user) {
      return done(null, false, req.flash('error_messages', 'Please create an account first！'))
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return done(null, false, req.flash('error_messages', 'Password is not correct！'))
    }

    return done(null, user)
  }
))

// set up passport GoogleStrategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    scope: ['email', 'profile']
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const { email, name } = profile._json
      const user = await Users.findOne({ email })
      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8)
        const newUser = await Users.create({
          name,
          email,
          password: bcrypt.hashSync(randomPassword, 10)
        })
        return done(null, newUser)
      }
      return done(null, user)
    } catch (err) {
      done(err, false)
    }
  }
))

// set up passport FacebookStrategy
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile)
      const { email, name } = profile._json
      console.log(email)
      console.log(name)
      const user = await Users.findOne({ email })
      if (!user) {
        console.log('no user')
        const randomPassword = Math.random().toString(36).slice(-8)
        const newUser = await Users.create({
          name,
          email,
          password: bcrypt.hashSync(randomPassword, 10)
        })
        console.log(newUser)
        return done(null, newUser)
      }
      console.log('has user')
      console.log(user)
      return done(null, user)
    } catch (err) {
      done(err, false)
    }
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await Users.findById(id).lean()
  done(null, user)
})

module.exports = passport
