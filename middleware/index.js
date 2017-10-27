var middlewareObj = {},
  Comment = require('../models/comment'),
  Campground = require('../models/campground');

// Middleware

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("success", "You have successfully logged in!")
    return next();
  }
  // will not render until after the redirect
  req.flash("error", "You need to be logged in to do that!")
  res.redirect('/login')
}

middlewareObj.checkCommentOwner = function(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    // does user own the Comment
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Comment not found!")
        res.redirect('back');
      }
      else {
        // Object vs String, dont use '===' or '=='
        if (foundComment.author.id.equals(req.user._id)) {
          req.flash("success", "Editted Comment!")
          next();
        }
        else {
          req.flash("error", "You cannot do that!")
          // previous page the user was on
          res.redirect('back');
        }
      }
    })
  }
  else {
    req.flash("error", "You need to be logged in to do that!")
    res.redirect('back')
  }
}

middlewareObj.checkCampgroundOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    // does user own the Campground
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        req.flash("error", "Campground not found!")
        res.redirect('/campgrounds');
      }
      else {
        // Object vs String, dont use '===' or '=='
        if (foundCampground.author.id.equals(req.user._id)) {
          req.flash("success", "Editted Campground!")
          next();
        }
        else {
          req.flash("error", "You cannot do that!")
          // previous page the user was on
          res.redirect('back');
        }
      }
    })
  }
  else {
    req.flash("error", "You need to be logged in to do that!")
    res.redirect('back')
  }
}


module.exports = middlewareObj;
