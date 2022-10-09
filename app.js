if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const errorHandler = require('./middleware/errorHandler').errorHandler
const routes = require('./routes')

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

const app = express()
const port = 3000

//  middleware: use express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//  middleware: use session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

//  middleware: use body-parser
app.use(express.urlencoded({ extended: true }))

//  middleware: use staic file
app.use(express.static('public'))

//  middleware: to correspond restful api update delete...
app.use(methodOverride('_method'))

// middleware: call passport definition
usePassport(app)

//  middleware: use flash
app.use(flash())

//  middleware: res.locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

// middleware: lead traffic to routes
app.use(routes)

//  middleware: 500 errorHandler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
