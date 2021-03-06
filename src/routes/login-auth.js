'use strict'

const config = require('config')
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
      url: `${config.get('conchaUserApi')}/users/member/${email}/${password}`,
      headers: {
        'Accept': 'application/json'
      }
    }

    request(options, (err, apiResponse, user) => {
      if (err) {
        const err = new Error()
        err.status = 500
        err.message = null
        return reject(err)
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
    // @todo
    // Refactor to use the shared library
    // Retrieve and attach the user's acl
    return new Promise((resolve, reject) => {
      // @todo
      // Duplicated in app.js. Extract this to a central location.
      options = {
        url: `${config.get('conchaAuthApi')}/access-control/${user.role}`,
        headers: {
          'Accept': 'application/json'
        }
      }

      request(options, (err, apiResponse, acl) => {
        if (err) {
          // @todo - logging
          const err = new Error()
          err.status = 500
          err.message = null
          return reject(err)
        }

        if (apiResponse.statusCode !== 200) {
          // Not authenticated.
          const err = new Error()
          err.status = apiResponse.statusCode
          err.message = apiResponse.body
          return reject(err)
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
            const err = new Error()
            err.statusCode = 500
            err.message = null
            return reject(err)
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
  .catch((err) => {
    res.status(err.status)
    res.json({ message: err.message })
  })
})

module.exports = router
