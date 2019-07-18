var express = require("express");
var router  = express.Router();
var passport = require("passport");
var bodyParser = require('body-parser');
var User = require("../models/user");
var Movie = require("../models/movie");

// ROOT route
router.get("/", (req, res) => {
  res.render("landing");
});

// SHOW about page
router.get('/about', (req, res) => {
  res.render('about');
})

// SHOW register form
router.get("/register", (req, res) => {
  res.render("register", {page: 'register'});
});

// HANDLE sign up logic
router.post('/register', (req, res) => {
	var newUser = new User({username: req.body.username, fullName: req.body.fullName});
	if (req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('register', {error: err.message});
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
			res.redirect('/movies');
		});
	});
});

// SHOW login form
router.get("/login", (req, res) => {
  res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login",
	passport.authenticate("local",
    {
      successRedirect: "/movies",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: 'Welcome to Filmstagram!'
    }),
    (req, res) => {
    console.log('warked');
});

// router.post('/login',
//   passport.authenticate('local'),
//   (req, res) => {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/movies');
//   });

// LOGOUT route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "See you later!");
	res.redirect("/login");
});

router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect('/movies');
      } else {
        Movie.find().where('author.id').equals(user._id).exec((err, movies) => {
          if (err) {
            console.log(err);
            res.redirect('/movies');
          }
          res.render('users/show', {user: user, movies: movies});
        });
      }
  });
});


module.exports = router;
