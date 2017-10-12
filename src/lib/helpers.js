'use strict'

const config = require('config')
const request = require('request')
const bearerToken = require('bearer-token')
const jwt = require('jsonwebtoken')

async function getGuestUser () {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${config.get('conchaUserApi')}/users/guest`,
      headers: {
        'Accept': 'application/json'
      }
    }

    request(options, (err, res, user) => {
      if (err) {
        // @todo logging 500
        return reject(err)
      }

      if (res.statusCode !== 200) {
        const message = res.body ? JSON.parse(res.body) : res.body
        const err = new Error(message)
        err.status = 500
        return reject(err)
      }

      // Parse the user string so we can work with it as a JSON object.
      return resolve(JSON.parse(user))
    })
  })
}

async function getToken (req) {
  return new Promise((resolve, reject) => {
    bearerToken(req, (err, token) => {
      if (err) {
        // @todo Error 500
        return reject(err)
      }

      return resolve(token)
    })
  })
}

async function getUserByToken (token) {
  return new Promise((resolve, reject) => {
    // @todo - Parameterise
    jwt.verify(token, 'secret', (err, decodedUser) => {
      if (err) {
          // @todo 403
        return reject(err)
      }
      return resolve(decodedUser)
    })
  })
}

// Returns User as a JSON object
async function getUserACLByRole (role) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${config.get('conchaAuthApi')}/access-control/${role}`,
      headers: {
        'Accept': 'application/json'
      }
    }

    request(options, (err, res, acl) => {
      if (err) {
        // @todo logging 500
        return reject(err)
      }

      if (res.statusCode !== 200) {
        // Not authenticated.
        res.body = res.body ? JSON.parse(res.body) : res.body
        const err = new Error(res.body)
        err.status = 500
        return reject(err)
      }

      return resolve(JSON.parse(acl))
    })
  })
}

function isUserAuthorised (resource, permission, acl) {
  let isAuthorised = false
  for (const index in acl) {
    if ((acl[index].resource === resource) && (acl[index].permission === permission)) {
      isAuthorised = true
      break
    }
  }
  return isAuthorised
}

module.exports = {
  getGuestUser,
  getToken,
  getUserByToken,
  getUserACLByRole,
  isUserAuthorised
}
