const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  //  passport definition: local
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email', 
      passReqToCallback: true 
    }, 
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) return done(null, false, { message: 'That email is not registered!' })
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return done(null, false, { message: 'Email or Password incorrect.' })
        
        return done(null, user)
      } catch (err) {
        done(err, false)
      }
  }))
  //  passport definition: facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    thirdPartyOAuthCallback 
  ))
  //  passport definition: google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  },
    thirdPartyOAuthCallback 
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}

async function thirdPartyOAuthCallback(accessToken, refreshToken, profile, done) {
  try {
    const { name, email } = profile._json
    const user = await User.findOne({ where: { email } })
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      await User.create({
        name,
        email,
        password: hash
      })
    }
    return done(null, user)
  } catch (err) {
    return done(err, false)
  }
}
