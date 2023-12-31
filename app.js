// include related modules
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

require('./config/mongoose')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helper')
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')
const app = express()
const port = process.env.PORT

app.engine('hbs', handlebars(
  {
    extname: '.hbs',
    helpers: handlebarsHelpers
  }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`App is running on http://localhost:${port}`)
})
