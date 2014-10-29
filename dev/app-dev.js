var express = require('express');
var app = express();

var Datastore = require('nedb');
var db = {};
db.tilesets = new Datastore({ filename: 'data/tilesets.db', autoload: true });
db.users = new Datastore({ filename: 'data/users.db', autoload: true });
db.maps = new Datastore({ filename: 'data/maps.db', autoload: true });

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//This is the stragity
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('a loging attpemt was made');
		/*db.users.find({ username: username }, function (err, user) {
			if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});*/
	}
));

app.post('/login',
	passport.authenticate('local', { 
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: false
	})
);

var sampleTileset = {
	image : 'img/sampletileset.png',
	imageheight : 256,
	imagewidth : 256,
	name : 'sample',
	tilewidth : 32,
	tileheight : 32,
	owner : 'admin',
	shared : true	
}

db.tilesets.find({name :'sample', owner:'admin'}, function(err,docs){
	if(docs.length < 1){
		db.tilesets.insert(sampleTileset, function (err, newDoc){
			console.log('Created Sample Tileset');
		});
	}
});

app.get('/login', function(req,res){
	res.sendFile(__dirname + '/login.html');
});
/*
app.use('/', ensureAuthenticated, function(req,res,next){	
	return express.static(__dirname)
});
*/
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

app.listen(1999);
