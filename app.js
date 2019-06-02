const express 		= require('express'),
	  bodyParser 	= require('body-parser'),
	  mongoose 		= require('mongoose');

// requiring routes
const indexRoutes      = require("./routes/index");

const app = express();
const uri = 'mongodb+srv://devUser:devUserPassword@cluster0-64kw3.mongodb.net/test?retryWrites=true&w=majority';

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use("/", indexRoutes);

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

// Skier.create({name: 'Henrik Harlaut', company: 'Armada', image: 'https://images.newschoolers.com/images/17/00/87/79/61/877961_1280w_720h.jpeg'});

// app.get('/', (req, res) => {
// 	res.render('landing');
// });

// app.get('/skiers', (req, res) => {
// 	Skier.find({}, (err, skiers) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			// var name = req.body.name;
// 			// var image = req.body.image;
// 			// var company = req.body.company;
// 			res.render('index', {skiers: skiers});
// 		}
// 	});
// });

// app.get('/skiers/new', (req, res) => {
// 	res.render('new');
// });

app.listen(3000);
// app.listen(process.env.PORT, process.env.IP);