var express = require("express");
var router  = express.Router();
var request = require('request');
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'cgalatro',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// var geocoder = require('geocoder');

var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
//INDEX - show all movies
router.get("/", isLoggedIn, (req, res) => {
  if (req.query.search && req.xhr) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // Get all movies from DB
    Movie.find({name: regex}, function(err, allMovies){
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(allMovies);
      }
    });
  } else {
    // Get all movies from DB
    Movie.find({}, (err, allMovies) => {
      if (err) {
        console.log(err);
      } else {
        if (req.xhr) {
          res.json(allMovies);
        } else {
          res.render("movies/index",{movies: allMovies, page: 'movies'});
        }
      }
    });
  }
});

// SEARCH - show results of user-search
router.get('/search', isLoggedIn, (req, res) => {
  var query = req.query.search;
  request('http://omdbapi.com/?s=' + query + '&apikey=thewdb', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      if (data['Search'] != undefined) {
        res.render('movies/search', {movies: data})
      } else {
        res.redirect('/movies');
      }
    }
  });
});

// NEW - show form to create a new movie post
router.get('/new', isLoggedIn, (req, res) => {
	res.render('movies/new');
});

//CREATE - add new movie to DB
router.post("/", isLoggedIn, upload.single('image'), (req, res) => {
  // console.log(req.body);
  cloudinary.uploader.upload(req.body.file.path, (result) => {
    // add cloudinary url for the image to the movie object under image property
    req.body.movie.image = result.secure_url;
    // add author to movie
    req.body.movie.author = {
      id: req.user._id,
      username: req.user.username
    }
  }
	// get data from form and add to movies array
	var title = req.body.title;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
  	id: req.user._id,
  	username: req.user.username
	};
  var newMovie = {title: title, image: image, description: desc, author: author};
  // Create a new movie and save to DB
  Movie.create(newMovie, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      //redirect back to movies page
      console.log(newlyCreated);
      res.redirect("/movies");
    }
  });
});

// SHOW - shows more info about one movie
router.get("/:id", isLoggedIn, (req, res) => {
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
