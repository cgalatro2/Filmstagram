const express 			= require('express'),
	  bodyParser 		= require('body-parser'),
	  mongoose 			= require('mongoose'),
	  passport    		= require("passport"),
	  LocalStrategy 	= require("passport-local"),
	  flash 			= require('express-flash'),
	  cookieParser = require("cookie-parser"),
	  Movie  			= require("./models/movie"),
	  Comment   		= require("./models/comment"),
      User        		= require("./models/user"),
	  session 			= require("express-session"),
	  seedDB      		= require("./seeds"),
	  methodOverride	= require("method-override");

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

app.use("/", indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

// app.listen(3000);
app.listen(process.env.PORT, process.env.IP);