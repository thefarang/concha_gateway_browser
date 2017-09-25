'use strict';

const express = require('express');
const request = require('request');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bearerToken = require('bearer-token');
const jwt = require('jsonwebtoken');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// @todo
// Include validation middleware on all incoming user data

// If the token exists, verify and store to req.user. If not, create
// a Guest object and store to req.user. Then check if the requested
// route is authorised for this user.
app.use((req, res, next) => {
  bearerToken(req, (err, token) => {

    if (err) {
      res.status(500);
      res.set('Cache-Control', 'private, max-age=0, no-cache');
      res.send();
      return;
    }

    new Promise((resolve, reject) => {

      if (token) {
        // @todo
        // Remove the 'secret' string into config
        jwt.verify(token, 'secret', (err, decoded) => {
          if(err) {
            return reject(403);
          }

          // Save the decoded token to the request for use in other routes.
          req.user = decoded;
          return resolve();
        });
      } else {
        req.user = {
          role: 1 // @todo - Replace with Role.Guest or replace with API call?
        };
        return resolve();
      }
    })
    .then(() => {

      // @todo
      // Create a Guest token so that the following only needs to happen once
      // Assign Guest user access control list, if applicable.
      return new Promise((resolve, reject) => {
        if (token) {
          return resolve();
        }

        // @todo
        // This is a copy of what happens in login-auth.js, so share this code somewhere.
        const options = {
          url: `http://concha_auth:3002/api/v1/access-control/${req.user.role}`, // @todo config this
          headers: {
            'Accept': 'application/json'
          }
        };

        request(options, (err, apiResponse, acl) => {
          if (err) {
            // @todo - logging
            return reject(500, null);
          }

          if (apiResponse.statusCode !== 200) {
            // Not authenticated.
            return reject(apiResponse.statusCode, JSON.parse(apiResponse.body));
          }
    
          // Parse the user string so we can work with it as a JSON object.
          req.user.acl = JSON.parse(acl);
          return resolve();
        });
      });
    })
    .then(() => {
      // @todo
      // DO YOU HAVE TO RETURN PROMISES IN A THEN(), OR CAN WE SIMPLY RETURN?

      // Determine if the user is permitted to access the resource
      return new Promise((resolve, reject) => {
        if (!isAuthorised(req.path, req.method.toLowerCase(), req.user.acl)) {
          return reject(401);
        }
        return resolve();
      });
    })
    .then(() => {
      // @todo
      // Extract this into debugging
      // The user is permitted to access the resource.
      console.log('The TOKEN IS-------');
      console.log(req.user);
      next();
    })
    .catch((statusCode) => {
      res.status(statusCode);
      res.set('Cache-Control', 'private, max-age=0, no-cache');
      res.send();
      return;
    });
  });
});

const index = require('./routes/index');
const login = require('./routes/login');
const loginAuth = require('./routes/login-auth');
const dashboard = require('./routes/dashboard');
const register = require('./routes/register');
// const registerSubmit = require('./routes/register-submit');

app.use('/', index);
app.use('/login', login);
app.use('/login-auth', loginAuth);
app.use('/dashboard', dashboard);
app.use('/register', register);
// app.use('/logout', logout); // @reminder - this is not needed with tokens, the client can simply delete the token

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// @todo
// Extract this to an appropriate file.
function isAuthorised(resource, permission, acl) {
  let isAuthorised = false;
  for (const index in acl) {
    if ((acl[index].resource === resource) && (acl[index].permission === permission)) {
      isAuthorised = true;
      break;
    }
  }
  return isAuthorised;
}

module.exports = app;
