'use strict'

const request = require('request')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/', (req, res, next) => {
  // Url-encode the email & password strings before we send them to the user service as part of
  // a GET request, incase the strings includes one or more forward slashes or spaces etc.
  const email = encodeURIComponent(req.body.email)
  const password = encodeURIComponent(req.body.password)
  let options = null

  new Promise((resolve, reject) => {
    // Send email and password to the user service to authenticate and return
    // the user details.
    options = {
      url: `http://concha_user/api/v1/users/${email}/${password}`, // @todo config this
      headers: {
        'Accept': 'application/json'
      }
    }

    request(options, (err, apiResponse, user) => {
      if (err) {
        return reject(500, null)
      }

      if (apiResponse.statusCode !== 200) {
        // Not authenticated.
        return reject(apiResponse.statusCode, JSON.parse(apiResponse.body))
      }

      // Parse the user string so we can work with it as a JSON object.
      return resolve(JSON.parse(user))
    })
  })
  .then((user) => {
    // Retrieve and attach the user's acl
    return new Promise((resolve, reject) => {
      // @todo
      // Duplicated in app.js. Extract this to a central location.
      options = {
        url: `http://concha_auth/api/v1/access-control/${user.role}`, // @todo config this
        headers: {
          'Accept': 'application/json'
        }
      }

      request(options, (err, apiResponse, acl) => {
        if (err) {
          // @todo - logging
          return reject(500, null)
        }

        if (apiResponse.statusCode !== 200) {
          // Not authenticated.
          return reject(apiResponse.statusCode, JSON.parse(apiResponse.body))
        }

        // Parse the user string so we can work with it as a JSON object.
        user.acl = JSON.parse(acl)
        return resolve(user)
      })
    })
  })
  .then((user) => {
    // Create a json web token from the user object.
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
          acl: user.acl
        },
        'secret', // @todo - Replace the 'secret' with a pass phrase stored in the config
        {
          expiresIn: '1h'
        },
        (jwtError, token) => {
          if (jwtError) {
            // @todo - add logging
            return reject(500, null)
          }

          // Authenticated
          return resolve(token)
        }
      )
    })
  })
  .then((token) => {
    res.status(200)
    res.json({ token: token })
  })
  .catch((statusCode, body) => {
    res.status(statusCode)
    res.json({ message: body })
  })
})

module.exports = router
