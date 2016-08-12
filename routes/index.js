var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET loading page. */
router.get('/loading', function(req, res, next) {
  res.render('loading');
});

/* GET board page. */
router.get('/board', function(req, res, next) {
  res.render('board');
});

module.exports = router;
