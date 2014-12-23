MapEditor = function (options) {

	options = options || {};

	this.mainContainer = options.main || '';
	this.gridContainer = options.grid ||'';
	this.tilesetContainer = options.tileset ||'';

	this.Intercom = options.Intercom || new Intercom();
	this.EventEmitter = this.Intercom.EventEmitter;
	this.tools = {
		single  : {
			name : 'single',
			title : 'Single',
			image : '/img/ui/single.png'
		},
		eraser : {
			name : 'eraser',
			title : 'Eraser',
			image : '/img/ui/erase.png'
		}
	};
	var tools = options.tools || {};
	Phaser.Utils.extend(this.tools , tools);
	this.map = {};

	this.listenOutFor = [
	//FROM UI
	{
		event:'createMap',
		action : 'create'
	},
	{
		event :'saveMap',
		action : 'saveMap'
	},
	{
		event : 'loadMap',
		action : 'load'
	}
	//FROM Editor
	];

	this.Intercom.setupListeners(this);
};

MapEditor.prototype.constructor = MapEditor;

Phaser.Utils.extend(MapEditor.prototype , {
	setup : function(name,grid,tileset,id){
		this.destroy();
		this.map = {};
		this.map.name =  name || 'My Map';
		this.map.id = id || $uid();

		tileset = tileset || {};
		tileset.container = tileset.container || this.tilesetContainer;
		this.tileset = new MapEditor.Tileset(tileset, this);

		grid = grid || {};
		grid.container = grid.container || this.gridContainer;
		this.grid = new MapEditor.Map(grid, this);

		//We can have a go between here so phaser events don't mesh with other events
		this.layerManager = new MapEditor.LayerManager(grid, this);

		//TODO: These have not been setup yet
		this.toolManager = new MapEditor.ToolManager(this);
		this.triggerManager = new MapEditor.TriggerManager(this);
		this.spriteManager = new MapEditor.SpriteManager(this);

		//ads in some settings
		this.EventEmitter.once('ToolsLinked', function(grid){
			this.loadTools();
		}.bind(this));

	},

	create : function(name,grid,tileset,id){
		this.setup(name,grid,tileset,id);
		//Since we are in create instead of load it just makes the base layer
		this.EventEmitter.once('LayersGroupLinked', function(grid){
			this.EventEmitter.trigger('createLayer', ['base']);
		}.bind(this));
	},

	load : function(map){

		if(typeof map.tilemap === 'string'){
			map.tilemap = JSON.parse(map.tilemap);
		}


		var tileset = {
			image : map.tileset.image,
			imageheight : Number(map.tileset.imageheight),
			imagewidth : Number(map.tileset.imagewidth),
			name : map.tileset.name,
			tilewidth : Number(map.tileset.tilewidth),
			tileheight : Number(map.tileset.tileheight),
			collisionTiles : map.tileset.collision,
			id : map.tileset._id
		};

		var grid = {
			tilewidth : map.tilemap.tilewidth,
			tileheight : map.tilemap.tileheight,
			tilesx : map.tilemap.width,
			tilesy : map.tilemap.height
		};
		this.destroy();
		this.setup(map.name,grid,tileset,map.id);

		this.EventEmitter.once('LayersGroupLinked', function(grid){
			this.EventEmitter.trigger('loadLayers',[map]);
		}.bind(this));

		/*
		//the create has already made the grid
		this.grid.events.tilesetLoaded.add(function(){
			this.grid.loadLayers(map);
		}, this);
		//this.loadMapData = map;

		//TODO: this is waiting o nthe wrong thing
		/*
		if(this.tileset.loaded === false	){
		this.tileset.onLoad = this._load.bind(this);
	} else {
	this._load();
}
*/
},

	loadTools : function(){
		for(var tool in this.tools){
			this.toolManager.create(this.tools[tool]);
		}
	},

	destroy : function(){
		delete this.map;

		if(this.grid) {
			this.Intercom.stopListening(this.grid);
			this.grid.destroy();
			delete this.grid;
		}

		if(this.tileset){
			console.log(this.tileset);
			this.Intercom.stopListening(this.tileset);
			this.tileset.destroy();
			delete this.tileset;
		}

		if(this.layerManager){
			console.log(this.layerManager);
			this.Intercom.stopListening(this.layerManager);
			delete this.layerManager;
		}
	},

	/*
	* Saves the Map
	*/
	saveMap : function(){

		var layers = [];

		//TODO: sort by the layers z index
		//into a temp array so they can be placed in this array in order
		var tempArr = [];
		for(var l in this.layerManager.layers){
			tempArr.push([l,this.layerManager.layers[l].order]);
		}

		tempArr.sort(function(a,b){return a[1]-b[1];});
		var mapLayers = {};

		for(var i = 0; i < tempArr.length; i++){
			var layer = this.layerManager.layers[tempArr[i][0]];
			var ar = [];

			for(var t in layer.tiles){
				ar.push(layer.tiles[t].tilesetId);
			}

			layers.push({
				data : ar,
				height : Number(this.grid.tilesy),
				name : layer.id,
				opacity : 1,
				type : 'tilelayer',
				visible : true,
				width: Number(this.grid.tilesx),
				x : 0,
				y: 0
			});

			mapLayers[layer.id] = {
				id : layer.id,
				name : layer.name,
				order : layer.order
			};
		}

		var json = {
			height : Number(this.grid.tilesy),
			width: Number(this.grid.tilesx),
			layers  : layers,

			//TODO: possibly of combining tilesets
			tilesets : [
			{
				firstgid : 1,
				image : this.tileset.image,
				imageheight : Number(this.tileset.imageheight),
				imagewidth : Number(this.tileset.imagewidth),
				margin : 0,
				name : this.tileset.name,
				spacing : 0,
				tileheight: Number(this.tileset.tileheight),
				tilewidth : Number(this.tileset.tilewidth)
			}
			],
			orientation:"orthogonal",
			tileheight : Number(this.tileset.tileheight),
			tilewidth:Number(this.tileset.tilewidth),
			version :1
		};

		this.map.tilemap = json;
		this.map.layers = mapLayers;
		this.map.tilesetId = this.tileset.id;
		this.EventEmitter.trigger('mapReadyForSave',[this.map]);
		//	return this.map;
	},

changeSettings : function(){},

launchGame : function(options){

	this.eOptions = options;
	this.events.mapSaved.addOnce(this._launchGame, this);
	this.saveMap();
},

_launchGame : function(map){

	var options = this.eOptions;
	options.map = this.map;
	options.map.tileset = this.tileset;

	this.grid.destroy();
	this.tileset.destroy();
	delete this.grid;
	delete this.tileset;

	GameMaker.UI.Actions._playGame(options);
},

});
