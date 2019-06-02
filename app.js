const express 		= require('express'),
	  bodyParser 	= require('body-parser'),
	  mongoose 		= require('mongoose'),
	  passport    = require("passport"),
	  LocalStrategy = require("passport-local"),
	  flash        = require("connect-flash"),
	  Movie  = require("./models/movie"),
	  Comment     = require("./models/comment"),
      User        = require("./models/user"),
	  session = require("express-session"),
	  seedDB      = require("./seeds"),
	  methodOverride = require("method-override");

// requiring routes
const indexRoutes		= require("./routes/index"),
	  commentRoutes		= require('./routes/comments'),
	  movieRoutes		= require('./routes/movies');

const app = express();
const uri = 'mongodb+srv://devUser:devUserPassword@cluster0-64kw3.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.locals.moment = require('moment');
seedDB();

app.use(require("express-session")({
    secret: "Inglorious Basterds",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/movies", function(req, res){
//   if(req.query.search && req.xhr) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//       // Get all campgrounds from DB
//       Movie.find({name: regex}, function(err, allMovies){
//          if(err){
//             console.log(err);
//          } else {
//             res.status(200).json(allMovies);
//          }
//       });
//   } else {
//       // Get all campgrounds from DB
//       Movie.find({}, function(err, allMovies){
//          if(err){
//              console.log(err);
//          } else {
//             if(req.xhr) {
//               res.json(allMovies);
//             } else {
//               res.render("movies/index",{movies: allMovies, page: 'movies'});
//             }
//          }
//       });
//   }
// });

app.use("/", indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

// app.listen(3000);
app.listen(process.env.PORT, process.env.IP);