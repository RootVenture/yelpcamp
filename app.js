var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  Campground = require('./models/campground'),
  seedDB = require("./seeds"),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  flash = require('connect-flash'),

  // requiring routes
  commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  authRoutes = require('./routes/index');

// seedDB(); // seed the database
mongoose.Promise = global.Promise;

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, { useMongoClient: true });
// mongoose.connect("mongodb://team:password@ds237855.mlab.com:37855/my_yelpcamp", { useMongoClient: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// point to custom CSS folder
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Shhh my secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to add use object to each route
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  // req to move to route handler
  next();
});

// Refactored routes to use separate files
app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("YELPCAMP SERVER HAS STARTED");
})
