const express = require('express')
const router = express.Router();

/* router.get('/', (req, res) => {
    res.send('Hello World!')
  }) */

  router.get('/', function (req, res) {
    res.send('Hello World!')
  })

  router.get('/json', function (req, res) {
    res.json({name: 'JSON Hallo'})
  })

  module.exports = router;