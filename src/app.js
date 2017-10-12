'use strict'

const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser') // @todo remove this
const bodyParser = require('body-parser')

const helpers = require('./lib/helpers')
const index = require('./routes/index')
const login = require('./routes/login')
const loginAuth = require('./routes/login-auth')
const dashboard = require('./routes/dashboard')
const register = require('./routes/register')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
  try {
    const token = await helpers.getToken(req)
    if (token) {
      req.user = await helpers.getUserByToken(token)
    } else {
      req.user = await helpers.getGuestUser()
      req.user.acl = await helpers.getUserACLByRole(req.user.role)
    }

    if (!helpers.isUserAuthorised(req.path, req.method.toLowerCase(), req.user.acl)) {
      const err = new Error(null)
      err.status = 401
      throw err
    }
    return next()
  } catch (err) {
    // @todo logging
    return next(err)
  }
})

app.use('/', index)
app.use('/login', login)
app.use('/login-auth', loginAuth)
app.use('/dashboard', dashboard)
app.use('/register', register)
// const registerSubmit = require('./routes/register-submit');
// app.use('/logout', logout); // @reminder - this is not needed with tokens, the client can simply delete the token

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// @todo
// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
