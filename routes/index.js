var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user');

// ROOT ROUTE
router.get('/', function(req, res) {
  res.render('landing');
})

// REGISTER ROUTES
router.get('/register', function(req, res) {
  res.render('register');
})

router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect('/campgrounds');
    })
  });
})

// LOGIN ROUTE
router.get('/login', function(req, res) {
  res.render('login');
})

// LOGOUT ROUTE
router.get('/logout', function(req, res) {
  req.logout();
  req.flash("success", "You have logged out!");
  res.redirect('/campgrounds');
})

// note the middleware for the authentication
router.post('/login', passport.authenticate('local', { successRedirect: "/campgrounds", failureRedirect: "/login" }),
  function(req, res) {})

module.exports = router;
