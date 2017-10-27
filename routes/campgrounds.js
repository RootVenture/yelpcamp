var express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  middleware = require('../middleware');

// INDEX route - show all campgrounds
router.get('/', function(req, res) {
  // get campgrounds from db
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err.toString());
    }
    else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  })
});

// NEW - show form to create a new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
  res.redirect('campgrounds');
})

// CREATE - Add new campgrounds
router.post('/', middleware.isLoggedIn, function(req, res) {
  // get data from form
  var name = req.body.name,
    price = req.body.price,
    image = req.body.image,
    desc = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username
    },
    newCampground = {
      name: name,
      price: price,
      image: image,
      description: desc,
      author: author
    }

  // add to campgrounds db
  Campground.create(
    newCampground,
    function(err, newlyCreated) {
      if (err) {
        console.log(err.toString());
      }
      else {
        console.log("New Campground:");
        console.log(newlyCreated);
        // redirect to campgrounds page
        res.redirect("campgrounds")
      }
    })
})

// SHOW - shows info about ONE campground
router.get('/:id', function(req, res) {
  // find the campground with the provided id. populate the comments with the executed code:
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err.toString());
    }
    else {
      // render show template with that id
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
})

// EDIT CAMPPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwner, function(req, res) {

  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      res.redirect('/campgrounds');
    }
    else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  })
})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwner, function(req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
    if (err) {
      console.log(err.toString());
      res.redirect('/campgrounds');
    }
    else {
      // redirect to show page
      res.redirect('/campgrounds/' + req.params.id);
    }
  })

})

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/campgrounds')
    }
    req.flash("success", "Campground deleted");
    res.redirect('/campgrounds')
  })
});

module.exports = router;
