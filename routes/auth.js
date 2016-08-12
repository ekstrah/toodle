var express = require('express');
var router = express.Router();

var passport = require('passport');

// naver login page
router.get('/naver', 
  passport.authenticate('naver', {
    successRedirect: '/loading',
    failureRedirect: '/auth/naver'
  }),
  function (req, res) {
    console.log('/auth/naver failed, stopped');
});

router.get('/naver/callback', 
    function(req, res) {
  console.log(`req.params.code: ${req.params.code}`);
  console.log(`req.user: ${req.user}`);
  res.redirect('/loading');
});

// kakao login page
router.get('/kakao',
  passport.authenticate('kakao', {
    successRedirect: '/loading',
    failureRedirect: '/auth/kakao'
  }), 
  function (req, res) {
    console.log('/auth/kakao fails, stopped');
});

router.get('/kakao/callback', function (req, res) {
  console.log(`req.params.code: ${req.params.code}`);
  console.log(`req.user: ${req.user}`);
  res.redirect('/loading');
});

module.exports = router;

