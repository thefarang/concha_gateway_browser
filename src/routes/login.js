'use strict'

const express = require('express')
const router = express.Router()

// GET login page
router.get('/', (req, res, next) => {
  res.render('login', { title: 'Login page' })
})

module.exports = router
