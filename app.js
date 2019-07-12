const express 				= require('express'),
	  	bodyParser 			= require('body-parser'),
	  	mongoose 				= require('mongoose'),
	  	passport    		= require("passport"),
	  	LocalStrategy 	= require("passport-local"),
	  	flash 					= require('express-flash'),
	  	cookieParser 		= require("cookie-parser"),
	  	Movie  					= require("./models/movie"),
	  	Comment   			= require("./models/comment"),
    	User        		= require("./models/user"),
	  	session 				= require("express-session"),
	  	seedDB      		= require("./seeds"),
	  	methodOverride	= require("method-override");

const app = express();

// CONNECTING TO DB
const uri = 'mongodb+srv://devUser:devUserPassword@cluster0-64kw3.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR:', err.message);
});

// requiring routes
const indexRoutes			= require("./routes/index"),
	  	commentRoutes		= require('./routes/comments'),
	  	movieRoutes			= require('./routes/movies');

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser('secret'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIG
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// ROUTE simplification
app.use("/", indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
// app.listen(process.env.PORT, process.env.IP);
