var express = require('express');
var app = express();

var Datastore = require('nedb');
var db = {};
db.tilesets = new Datastore({ filename: 'data/tilesets.db', autoload: true });
db.users = new Datastore({ filename: 'data/users.db', autoload: true });
db.maps = new Datastore({ filename: 'data/maps.db', autoload: true });

app.use('/',express.static(__dirname+'/public'));
app.listen(1999);
