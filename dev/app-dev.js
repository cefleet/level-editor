var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var Datastore = require('nedb');
var multer  = require('multer')
var crypto = require('crypto');
var sanitize = require("sanitize-filename");

/********************************************
 * Setup Items
 ********************************************/ 
app.use(session({secret: 'keyboard cat'}));
app.use(bodyParser.urlencoded({
  extended: true
}));

var staticMiddleware = express.static(__dirname);
 
 /********************************************************
  * FUNCTIONS 
  ********************************************************/

//This is syroncus I know I shall fix it
function encryptPassword(password){
   var cipher = crypto.createCipher('aes-256-cbc', 'salt');
   cipher.update(password, 'utf8', 'base64');
   return cipher.final('base64');
}

function ensureAuthenticated(req, res, next) {
    if (req.session.user_id) { return next(); }
    res.redirect('/login')
}

/****************************************************
 *File Upload
 *****************************************************/

app.use(multer(
	{ 
		dest: './uploads/',
		rename: function (fieldname, filename) {
			console.log(fieldname);
			return Date.now();
		},
		onParseEnd: function (req,next) {
			console.log(req.body);
			console.log(req.files);
			//first check to see if tileset name is already there
			
			//if not then		
			//move file and rename based on the other
			//req.file.path
			
			//finally 
			//save to database
			//req.body is an object of fields
			
			next();
		}
	}
));

/**********************************************************
 * Database items
 *******************************************************/
 
var db = {};
db.tilesets = new Datastore({ filename: 'data/tilesets.db', autoload: true });
db.users = new Datastore({ filename: 'data/users.db', autoload: true });
db.maps = new Datastore({ filename: 'data/maps.db', autoload: true });


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

//creates sample tileset
db.tilesets.find({name :'sample', owner:'admin'}, function(err,docs){
	if(docs.length < 1){
		db.tilesets.insert(sampleTileset, function (err, newDoc){
			console.log('Created Sample Tileset');
		});
	}
});

var sampleUser = {
  username : 'admin',
  password : 'admin1234',
  enabled : 'true',
  level : 0
}

db.users.find({username :'admin'}, function(err,docs){
	if(docs.length < 1){
	  var ePassword = encryptPassword(sampleUser.password);	 
    sampleUser.password = ePassword;
		db.users.insert(sampleUser, function (err, newDoc){
			console.log('Created Sample User');
		});
	}
});


/*********************************************************
 * LOGIN Scripts
 *********************************************************/
//TODO need a create user
app.post('/login', function (req, res) {
  var post = req.body;
   db.users.find({username : post.username}, function(err,docs){
		//user has been found
		if(docs.length > 0){
			var ePassword = encryptPassword(post.password);      
			if(ePassword === docs[0].password){
				req.session.user_id = docs[0]._id;
				req.session.username = docs[0].username;
				req.session.user_level = docs[0].level;
				res.redirect('/');
			} else {
				res.redirect('/login');
			}
		} else {
			res.redirect('/login');
		}
	});   
});

app.get('/login', function(req,res){
	res.sendFile(__dirname + '/login.html');
});

/*****************************************************
 * User Creation Scripts
 * **************************************************/
app.post('/add_user', function(req,res){
	var post = req.body;
	db.users.find({username : post.username}, function(err,docs){		
		if(docs.length > 0){
			res.send('Already a user with that name');
		} else {
			//TODO make some password requirement here
			var enabled = true;
			if(!post.enabled){
				enabled = false;
			};
			var user = {
				username : post.username,
				password :  encryptPassword(post.password),
				level : post.level,
				enabled : enabled
			};
			db.users.insert(user, function (err, newDoc){
				res.send('Created New User : '+newDoc.username)
			});
		}
		console.log(post);
	});
});

app.get('/add_user', function(req,res){
	if(req.session.user_level < 1){
		res.sendFile(__dirname + '/add_user.html');
	} else {
		res.redirect('/');
	}
});


/***********************
 * Static files
 *****************************/ 
app.use('/',ensureAuthenticated, function(req,res,next){
   staticMiddleware(req, res, next);
});

app.listen(3030);
