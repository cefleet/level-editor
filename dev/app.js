var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var Datastore = require('nedb');
var multer  = require('multer')
var crypto = require('crypto');
var sanitize = require("sanitize-filename");
var fs = require('fs');

/********************************************
 * Setup Items
 ********************************************/
app.use(session({secret: 'Iamsgoing45ferfIfoyrt435fe4eDF34f'}));

app.use(bodyParser.urlencoded({
  extended: true
}));

var db = {};
db.tilesets = new Datastore({ filename: 'data/tilesets.db', autoload: true });
db.users = new Datastore({ filename: 'data/users.db', autoload: true });
db.maps = new Datastore({ filename: 'data/maps.db', autoload: true });

var staticMiddleware = express.static(__dirname+'/public');
//app.use
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
 *File Upload : Create Tileset
 *****************************************************/
//possibly app.use('/upload/', multer( ...
app.use(multer(
	{
		dest: './uploads/',
		onParseEnd: function (req,next) {
			//sanitize the name
			//possibly id
			var save = {
				image : 'img/'+sanitize(req.body.name)+Date.now()+'.'+req.files[0].extension,
				imageheight : Number(req.body.imageheight),
				imagewidth : Number(req.body.imagewidth),
				name : req.body.name,
				tilewidth : Number(req.body.tilewidth),
				tileheight : Number(req.body.tileheight),
				collision : req.body.collision.split(","),
				owner : req.session.user_id,
				shared : 	(req.body.shared === "true") //not too sure about this
			}

			//first check to see if tileset name is already there for that owner
			db.tilesets.find({name : save.name, owner : save.owner}, function(err,docs){

				if(docs.length < 1){
					db.tilesets.insert(save, function (err, newDoc){
						//TODO: should add a callback
						fs.rename(req.files[0].path, 'public/'+save.image);
						console.log('Created New Tileset');
					});
				} else {
					fs.unlink(req.files[0].path);
					console.log('There is already a tileset with that name');
				}
			});
			next();
		}
	}
));

/***************************************
 * Save Map
 * *************************************/
app.post('/save_map', ensureAuthenticated, function(req,res){
	var save = {
		name : req.body.name,
		id : req.body.id,
		tilemap : req.body.tilemap,
		tilesetId : req.body.tilesetId,
		owner : req.session.user_id,
		layers : req.body.layers
	}
	//first look for item
	//if found update
	db.maps.find({id : save.id, owner : save.owner}, function(err,docs){
		if(docs.length < 1){
			db.maps.insert(save, function (err, newDoc){
        res.contentType('json');
        res.send({status : 'success',message: 'Map Saved'});
			});
		} else {
			db.maps.update({id:save.id}, save,{}, function(err){
				console.log('Updated Map');
        res.contentType('json');
        res.send({status : 'success',message: 'Map Saved'});
			});
		}
	});
	//if not found add
});
/**********************************************************
 *Default  Database items
 *******************************************************/

var sampleTileset = {
	image : 'img/sampletileset.png',
	imageheight : 732,
	imagewidth : 1024,
	name : 'sample',
	tilewidth : 32,
	tileheight : 32,
	collision : [],
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
//TODO: need a create user
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
	res.sendFile(__dirname + '/public/login.html');
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
			//TODO: make some password requirement here
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
		res.sendFile(__dirname + '/public/add_user.html');
	} else {
		res.redirect('/');
	}
});

/************************
 * Initial Data
 * ***********************/
 app.get('/loading', ensureAuthenticated, function(req,res, next){
	var data = {};
	console.log(req.session.user_id);
	db.tilesets.find({$or : [{owner : req.session.user_id}, {shared : true}]}, function(err,docs){
		data.Tilesets = docs;
		db.maps.find({owner : req.session.user_id},function(err,docs){
			data.Maps = docs;
			res.send(data);
		});
	});
});

/***********************
 * Static files
 *****************************/
app.use('/',ensureAuthenticated, function(req,res,next){
   staticMiddleware(req, res, next);
});

//Remove for production
app.use('/node_modules',express.static(__dirname + "/node_modules"));

app.listen(3030);
