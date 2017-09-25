'use strict';

const express = require('express');
const router = express.Router();

// GET dashboard
router.get('/', (req, res, next) => {
  res.render('dashboard', { title: 'Dashboard page' });
});

module.exports = router;
