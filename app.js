const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
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

//  middleware: to correspond restful api update delete...
app.use(methodOverride('_method'))

// middleware: call passport definition
usePassport(app)

//  middleware: use flash
app.use(flash())

//  middleware: res.locals
app.use((res, req, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

// middleware: lead traffic to routes
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
