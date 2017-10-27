var express = require('express'),
  // merges params from campground and comments. Used so router can find the campground id.
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware');

// COMMENT ROUTES
// nested routes:
// NEW comments
router.get('/new', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err.toString());
    }
    else {
      res.render("comments/new", { campground: campground });
    }
  })
})

// CREATE comments
router.post('/', middleware.isLoggedIn, function(req, res) {
  // lookup campground using id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err.toString());
      res.redirect('/campgrounds');
    }
    else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err.toString());
        }
        else {
          // add username and id to comments
          comment.author.username = req.user.username;
          comment.author.id = req.user._id;
          comment.save();
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          console.log(comment)
          // redirect to campground showpage
          res.redirect('/campgrounds/' + campground._id);
        }
      })
    }
  })
})

// SHOW EDIT FORM
router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      console.log(err.toString());
      res.redirect('back');
    }
    else {
      res.render('comments/edit', { campground_id: req.params.id, comment: foundComment })
    }
  })
})

// UPDATE COMMENT
router.put('/:comment_id', middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('back');
    }
    else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
})

// DESTROY
router.delete('/:comment_id', middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('/campgrounds/' + req.params.id)
    }
    else {
      req.flash("success", "Comment deleted");
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
});

module.exports = router;
