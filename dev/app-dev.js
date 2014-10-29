var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({
  extended: true
}));
var crypto = require('crypto');
 
app.use(session({secret: 'keyboard cat'}));

var staticMiddleware = express.static(__dirname);
 
var Datastore = require('nedb');
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

//This is syroncus I know I shall fix it
function encryptPassword(password){
   var cipher = crypto.createCipher('aes-256-cbc', 'salt');
   cipher.update(password, 'utf8', 'base64');
   return cipher.final('base64');
}

//TODO need a create user
app.post('/login', function (req, res) {
  var post = req.body;
    console.log(post);
   //Again sycronous but i'll fix it
   db.users.find({username : post.username}, function(err,docs){

      //user has been found
      if(docs.length > 0){
        console.log(docs);
        var ePassword = encryptPassword(post.password);
        if(ePassword === docs[0].password){
          req.session.user_id = docs[0]._id;
          req.session.unsername = docs[0].username;
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      } else {
      console.log('no users by that unsername were found');
        //user not found.. needs to login again
        //would be nice to give a "flash too"
        res.redirect('/login');
      }
   });
  

  /*
  if (post.username === 'admin' && post.password ==='admin') {
    req.session.user_id = "12345678";
    res.redirect('/');
  } else {
     res.redirect('/login');
  } */
   
});

app.get('/login', function(req,res){
	res.sendFile(__dirname + '/login.html');
});

function ensureAuthenticated(req, res, next) {
    if (req.session.user_id) { return next(); }
    res.redirect('/login')
}

app.use('/',ensureAuthenticated, function(req,res,next){
   staticMiddleware(req, res, next);
});

app.listen(3030);
