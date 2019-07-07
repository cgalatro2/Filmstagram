var express = require("express");
var router  = express.Router();
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// var geocoder = require('geocoder');
var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
//INDEX - show all movies
router.get("/", isLoggedIn, (req, res) => {
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Movie.find({name: regex}, function(err, allMovies){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allMovies);
         }
      });
  } else {
    // Get all campgrounds from DB
    Movie.find({}, (err, allMovies) => {
      if(err){
        console.log(err);
        } else {
          if(req.xhr) {
            res.json(allMovies);
          } else {
            res.render("movies/index",{movies: allMovies, page: 'movies'});
          }
        }
      });
  }
});

// NEW - show form to create a new movie post
router.get('/new', (req, res) => {
	res.render('movies/new');
});

//CREATE - add new movie to DB
router.post("/", isLoggedIn, (req, res) => {
  	// get data from form and add to movies array
  	var title = req.body.title;
  	var image = req.body.image;
  	var desc = req.body.description;
  	// var author = {
  	// id: req.user._id,
  	// username: req.user.username
  	// };
	var author = req.user._id;
    var newMovie = {title: title, image: image, description: desc, author: author};
    // Create a new movie and save to DB
    Movie.create(newMovie, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/movies");
        }
    });
});

// SHOW - shows more info about one movie
router.get("/:id", (req, res) => {
    //find the movie with provided ID
    Movie.findById(req.params.id).populate("comments").exec((err, foundMovie) => {
        if(err || !foundMovie){
            console.log(err);
            req.flash('error', 'Sorry, that movie has not been posted!');
            return res.redirect('/movies');
        }
        console.log(foundMovie);
        //render show template with that movie
        res.render("movies/show", {movie: foundMovie});
    });
});

// EDIT - show edit form for changing a movie
router.get('/:id/edit', isLoggedIn, (req, res) => {
	res.render('movies/edit', {movie: req.movie});
});

module.exports = router;
