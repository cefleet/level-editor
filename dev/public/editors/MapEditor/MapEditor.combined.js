MapEditor = function (options) {

	options = options || {};

	this.mainContainer = options.main || '';
	this.gridContainer = options.grid ||'';
	this.tilesetContainer = options.tileset ||'';

	this.Intercom = options.Intercom || new Intercom();
	this.EventEmitter = this.Intercom.EventEmitter;

	this.map = {};
/*
	this.events = {
	  mapSaved : new Phaser.Signal()
	};
*/

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


		tileset = {
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

	destroy : function(){
		delete this.map;

		if(this.grid) {
			this.grid.destroy();
			delete this.grid;
		}

		if(this.tileset){
			this.tileset.destroy();
			delete this.tileset;
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
		console.log(this.map.layers);
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

MapEditor.Map = function (options,parent) {

	options = options || {};

	this.parent = options.parent || parent;
	this.EventEmitter = this.parent.EventEmitter;

	this.container = options.container;
	this.linecolor = options.line || 0x000000;
	this.loc = options.loc || [0,0];
	this.activeTileOp = 0;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.tilesy = options.tilesy || 16;
	this.tilesx = options.tilesx || 18;
	this.offsetx = 0;
	this.offsety = 0;
	this.scale = 1;
	this.baseHeight = this.tilesy*this.tileheight;
	this.baseWidth = this.tilesx*this.tilewidth;
	this.toolType = 'single';

	/*
	this.events = {
		toolChanged : new Phaser.Signal(),
		layerAdded : new Phaser.Signal(),
	};
*/
    //setup
    this.game = new Phaser.Game(this.tilewidth*this.tilesx,this.tileheight*this.tilesy, Phaser.CANVAS,this.container, {

		preload : function(){
			//TODO: this needs to be gotten from the tools section

			//this is a little funky but it's fine for now
			this.game.load.image('eraser', 'img/ui/erase.png');
			//this.game.load.image('single', 'img/ui/single.png');
			this.game.load.image('fill', 'img/ui/fill.png');
			this.game.load.image('select','img/ui/select.png');
			this.game.load.image('trigger','img/ui/trigger.png');
			this.game.load.image('sprite','img/ui/sprite.png');

		},

		create:function(){
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.setScreenSize();
			this.game.stage.backgroundColor ='#545454'; //''
			this.setup();

		}.bind(this)
	});

	this.listenOutFor = [
	{
		event : 'tileSelected',
		action :'setMarkerFromTile'
	},
	{
		event : 'toolChnaged',
		action : 'setToolType'
	},
	{
		event : 'tilesetLoaded',
		action : 'loadTilesetImage'
	},
	{
		event: 'activeLayerSet',
		action : 'setActiveLayer'
	},
	{
		event : 'layerVisibiltySet',
		action : 'toggleLayer'
	}
	];

	this.parent.Intercom.setupListeners(this);
	return this;
};

MapEditor.Map.prototype = {

	setup : function(){
		this.drawGrid();
		this.setupMouse();
		this.marker = this.game.add.sprite(0,0,'');
		this.marker.tilesetId = 0;

		this.layersGroup = this.game.add.group();
		this.EventEmitter.trigger('gridReadyForLayers', [this]);
	},

	/*
	 * Draws the grid
	 */
	drawGrid : function(){

		this.gridImage = this.game.add.graphics(0, 0);  //init rect
		this.gridImage.lineStyle(1, this.linecolor, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
		this.gridImage.drawRect(this.loc[0],this.loc[1], this.tilesx*this.tilewidth,this.tilesy*this.tileheight);

		var r = 0;
		var c = 0;

		while(r <= this.tilesx){
			this.gridImage.moveTo(this.loc[0]+(this.tilewidth*r), this.loc[1]); // x, y
			this.gridImage.lineTo(this.loc[0]+(this.tilewidth*r), this.tileheight*(this.tilesy)+this.loc[1]);
			r++;
		}

		while(c <= this.tilesy){
			this.gridImage.moveTo(this.loc[0], this.loc[1]+(this.tileheight*c)); // x, y
			this.gridImage.lineTo(this.tilewidth*(this.tilesx)+this.loc[0],this.loc[1]+(this.tileheight*c));
			c++;
		}
	},

	toggleLayer : function(layer){

	},

	setActiveLayer : function(layer){
		this.activeLayer = layer;
	},

	
	/*
	 * Returns the tile under the point (Point does not haveto be a real point it just an object with properties of x, y)
	 */
	getTileFromPoint : function(point){
		//Tiles are here
		for(var tile in this.activeLayer.tiles){
			var t = this.activeLayer.tiles[tile];
			if(point.x > t.x && point.x < t.x+this.tilewidth && point.y > t.y && point.y < t.y+this.tileheight){
				return t;
			}
		}
	},

	/*
	 * Sets the active Tile
	 * * This name should be moveMarkerToTileFromPoint
	 */
	setActiveTileFromPoint : function(point){
		var t = this.getTileFromPoint(point);
		if(t){
			this.activeTile = t;
			this.marker.x = t.x;
			this.marker.y = t.y;
		}
		return this.activeTile;
	},

	/*
	 * Uses the activeTile to set the tileset ID

	 */
	setTileIdOfActiveTileFromMarker : function(){
		this.activeTile.tilesetId = this.marker.tilesetId;
	},

	/*
	 * Uses the active tile and marker sprite to place a sprite on the
	 */
	setSpriteOfActiveTileFromMarker : function(){
		this.activeTile.sprite = this.game.add.sprite(this.marker.x,this.marker.y,this.marker.key,this.marker.frame);
		this.activeLayer.add(this.activeTile.sprite);
	},

	/*
	 * combines the id and sprite
	 */
	setActiveTileFromMarker : function(){
		this.unsetActiveTile();
		this.setTileIdOfActiveTileFromMarker();
		this.setSpriteOfActiveTileFromMarker();
	},
	/*
	 * Unsets the active tile
	 */
	unsetActiveTile : function(){
		if(this.activeTile){
			if(this.activeTile.sprite){
				this.activeTile.sprite.destroy();
			}
		}

		this.activeTile.tilesetId = 0;
	},

	setupMouse : function(){
		this.game.input.mouse.mouseMoveCallback = function(c){
			var p = {
				x : c.offsetX/this.scale,
				y : c.offsetY/this.scale
			};

			if(this.inGrid(p)){
				this.setActiveTileFromPoint(p);
				if(this.game.input.activePointer.isDown){

					if(c.which === 1){

						if(this.toolType === 'eraser'){
							this.unsetActiveTile();
						} else if(this.toolType === 'single') {
							this.setActiveTileFromMarker();
						}

					}
				}
			}
		}.bind(this);

		this.game.input.mouse.mouseDownCallback = function(c){
			var p = {
				x : c.offsetX/this.scale,
				y : c.offsetY/this.scale
			};
			if(this.inGrid(p)){
				this.setActiveTileFromPoint(p);

				if(c.which === 1){

						if(this.toolType === 'eraser'){
							this.unsetActiveTile();
						} else if(this.toolType === 'single') {
							this.setActiveTileFromMarker();
						} else if (this.toolType === 'trigger'){
							this.placeTrigger();
						} else if(this.toolType === 'sprite'){
							this.placeSprite();
						}
				}
			}
		}.bind(this);
	},

	destroy : function(){
		for(var g in this.layers){
			this.layers[g].destroy();
		}
		if(this.gridImage){
			this.gridImage.destroy();
		}
		if(this.game){
			this.game.input.mouse.mouseMoveCallback = function(){};
			this.game.input.mouse.mouseDownCallback = function(){};
			this.game.destroy();
		}
	},


	loadTilesetImage : function(t){
		this.spritesheet = this.game.load.spritesheet(t.name,t.image,t.tilewidth,t.tileheight);

		this.spritesheet.onLoadComplete.add(function(){
			this.EventEmitter.trigger('tilesetImageLoadedInGrid', [this]);
		}, this);


		this.spritesheet.start();
	},

	setToolType : function(t){
		/*
		 * t will be
		 * 'single' -single tile
		 * 'eraser'= erases tiles only.
		 * 'fill' = fills the whole layer with one tile
		 * 'sprite' = adds a sprite popup or it is a sprite image .. that's probaby the one
		 * 'selector' = will select information like if a sprite is in the grid or
		 * "trigger" = will add a trigger popup
		 */

		this.toolType = t;
		this.marker.destroy();
		if(this.toolType !== 'single'){
			this.marker = this.game.add.sprite(0,0, t);
		} else {
			this.marker = this.game.add.sprite(0,0, '');
		}
		this.marker.width = this.tilewidth;
		this.marker.height = this.tileheight;

		//this.events.toolChanged.dispatch(this.toolType);
	},

	setMarkerFromTile : function(t){

		if(this.toolType !== 'fill'){
			this.setToolType('single');
		}

		//only fill will keep the marker
		this.marker.destroy();
		this.marker = this.game.add.sprite(0,0, t.name, t.selectedTile.frame*1);
		this.marker.tilesetId = t.selectedTile.id;

	},

	/*
	 * Checks to see if point is in the grid
	 */
	inGrid : function(point){
		if(point.x > this.loc[0] && point.y > this.loc[1] && point.x < this.loc[0]+(this.tilesx*this.tilewidth) && point.y < this.loc[1]+(this.tilesy*this.tileheight)){
			return true;
		} else {
			return false;
		}
	},

	//Places the trigger
	placeTrigger : function(){
		console.log(this.activeTile);
		var loc = '';//get active tile location
		this.events.triggerPlaced.dispatch(loc);

		//TODO: this may need to be moved at some point in time
		//this.triggers.create();
	},

	placeSprite : function(){
		console.log(this.activeTile);
		var loc = '';//get active tile location
		this.events.spritePlaced.dispatch(loc);

		//TODO: this may need to be moved at some point in time
		//this.triggers.create();
	},
};

MapEditor.Map.prototype.constructor = MapEditor.Map;

MapEditor.Layer = function(options, parent){
  options = options || {};
  this.parent = parent;
  this.name = options.name || 'New Layer';
  this.id = options.id || $uid();

  this.tiles = {};
  this.parent.makeTiles(this);
  this.order = options.order;

  return this;
};

MapEditor.LayerManager  = function(options,parent){
  options = options  || {};
  //This is gleaned from th egrid
  this.tilewidth = options.tilewidth || 32;
  this.tileheight = options.tileheight || 32;
  this.tilesy = options.tilesy || 16;
  this.tilesx = options.tilesx || 18;
  this.loc = options.loc || [0,0];

  this.parent = parent;
  this.EventEmitter = this.parent.EventEmitter;
  this.layers = {};

  this.listenOutFor = [
  {
    event : 'createLayer',
    action :'create'
  },
  {
    event : 'makeLayerActive',
    action : 'makeLayerActive'
  },
  {
    event : 'toggleLayer',
    action : 'toggleLayer'
  },
  {
    event : 'gridReadyForLayers',
    action : 'linkLayerGroup'
  },
  {
    event : 'loadLayers',
    action : 'loadLayers'
  },
  {
    event : 'orderLayers',
    action : 'orderLayers'
  }
  ];

  this.parent.Intercom.setupListeners(this);
  return this;
};

MapEditor.LayerManager.prototype = {

  linkLayerGroup : function(grid){
    this.layersGroup = grid.layersGroup;
    this.EventEmitter.trigger('LayersGroupLinked');
  },

  create : function(name,id){
    id = id || $uid();
    name = name || 'New Layer';

    var highest = 0;
    for(var layer in this.layers){
      if(this.layers[layer].order >= highest) {
        highest = this.layers[layer].order+1;
      }
    }

    this.layers[id] = this.layersGroup.add(this.layersGroup.game.add.group());
    this.layers[id].id = id;
    this.layers[id].name = name;
    this.layers[id].order = highest;
    this.layers[id].tiles = {};
    this.makeTiles(this.layers[id]);

    this.EventEmitter.trigger('layerCreated', [this.layers[id]]);
    this.makeLayerActive(this.layers[id]);
  },

  loadLayers : function(map){
    this.layers = {};// this effictivly deletes the "base" layer that was added on create. There would not be anything in it so it shouldn't hurt anything
    var len = map.tilemap.layers.length;
    var layers = map.tilemap.layers;
    for(var j = 0; j < len; j++){
      this.loadLayer(layers[j], map);
    }
    //set the order
    var tempArr = [];
    for(var l in this.layers){
      tempArr.push([l,this.layers[l].order]);
    }
    tempArr.sort(function(a,b){return a[1]-b[1];});

    var orderArr = [];

    for(var i = 0; i < tempArr.length; i++){
      orderArr.push(tempArr[0]);
    }

    this.orderLayers(orderArr);
    //then get
    this.makeLayerActive(layers[0].name);
  },

  loadLayer : function(layer, map){
    var layerinfo = map.layers[layer.name];
    this.create(layerinfo.name,layerinfo.id);
    this.layers[layerinfo.id].order = layerinfo.order;
    var data = layer.data;
    for(var i = 0; i < data.length; i++){
      var id = data[i];
      var t = this.layers[layer.name].tiles[i];
      t.tilesetId = id;
      if(id !== 0){
        //frame starts with 0 first item
        /*******
        * WRONG DO NOT CALL LE FROM INSIDE
        */
        if(this.parent.tileset.tiles[id-1]){
          t.sprite = this.parent.grid.game.add.sprite(t.x,t.y,this.parent.tileset.name, this.parent.tileset.tiles[id-1].frame);
          this.layers[layerinfo.id].add(t.sprite);
        }
      }
    }
  },

  //make layer active
  makeLayerActive : function(layer){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }
    this.activeLayer = layer;
    this.EventEmitter.trigger('activeLayerSet',[layer]);
  },

  //Show Hid layer
  toggleLayer : function(layer){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }

    if(layer.visible){
      layer.visible = false;
    } else {
      layer.visible = true;
    }

    this.EventEmitter.trigger('layerVisibiltySet', [layer]);
  },

  renameLayer : function(layer, newName){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }

    layer.name = newName;
  },

  //orders the layers by id or actall object. order is an array
  orderLayers : function(order){
    var o = order.length;
    for(var i =0; i < order.length; i++){
      var layer = order[i];
      if(typeof  layer === 'string'){
        layer = this.layers[layer];
      }
      if(typeof layer !== 'undefined'){
        layer.order = o;
        this.layersGroup.sendToBack(layer);
        o--;
      }
    }

    this.EventEmitter.trigger('layerOrderSet');
  },

  deleteLayer : function(layer){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }
    this.layersGroup.remove(layer,true);
  },
  /*
  * Makes the tiles (id and location data) into an array
  * */
  makeTiles : function(layer){
    var r = 0;
    var i = 0;
    while(r < this.tilesy){
      var c = 0;
      while(c < this.tilesx){
        layer.tiles[i] = {
          x : c*this.tilewidth+this.loc[0],
          y : r*this.tileheight+this.loc[1],
          id : i,
          row : c,
          col : r,
          loc : c+'-'+r,
          tilesetId : 0
        };
        c++;
        i++;
      }
      r++;
    }
  }

};

MapEditor.LayerManager.prototype.constructor = MapEditor.LayerManager;

MapEditor.Trigger = function(options){
	options = options || {};
	this.id = options.id || $uid();
	this.name = options.name || 'sprite';
	this.spritesheet = options.spritesheet || 'img/player.png';
	this.frameSize = options.frameSize || {width : '', height:''}; //default is the whole image. Othewise it is a object with width/ height attributes
	this.location = options.location || {x:0,y:0};//location
	this.layer = options.layer || '0';

	//these all are added when you edit a sprite
	this.animations = false; //This is an object {name : [frames], name: [frames]}
	this.patrol = false; //or an array of locations
	this.onPlayerCollision = false; //The options here are false,destroy,trigger,or code //You can set it false and apply trigger from the trigger or apply it here
	this.onSpriteCollision = false;//What happens when colliding with another sprite false,destroy,trigger,or code

	//this is not nessessary for the editor.
	this.patrolling = false;
	this.patrolPos = 0; // the index of the sprites patrol

	return this;
};

MapEditor.SpriteManager = function(parent){
	this.parent = parent;
	this.EventEmitter = this.parent.EventEmitter;

	this.sprites = {};

	return this;
};

MapEditor.SpriteManager.prototype = {

	create : function(options){
	//	console.log(this);
		var t = new MapEditor.Sprite(options);
		this.sprites[t.id] = t;
		//this.events.spriteCreated.dispatch(t);
		this.EventEmitter.trigger('spriteCreated', t);
	}
};
MapEditor.SpriteManager.prototype.constructor = MapEditor.SpriteManager;

MapEditor.Tileset = function (options,parent) {
	//With these changes
	options = options || {};

	this.parent = options.parent || parent;
	this.EventEmitter = this.parent.EventEmitter;

	this.container = options.container;
	this.image  = options.image || 'img/sampletileset.png';
	this.name = options.name || 'tiles';
	this.imageheight = options.imageheight || 256;
	this.imagewidth = options.imagewidth || 256;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.collisionTiles = options.collisionTiles ||  [0,1,[2-23]]; //this is purposlly writtein to show that it can be an array of number or an array of arrays sets or a mixture
    this.tiles = {};
    this.bgColor = options.bgColor || {
		line : 0x2F2F2F,
		fill : 0x9C9C9C
	};
	this.loaded = false;

	if(!options.id) {
	  console.warn('There is no tileset id');
	} else {
		this.id = options.id;
	}

	this.game = new Phaser.Game(this.imagewidth+(this.imagewidth/this.tilewidth),this.imageheight+(this.imageheight/this.tileheight), Phaser.CANVAS,this.container, {
		create:function(){
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
			this.game.stage.backgroundColor ='#000000';

			this.spritesheet = this.game.load.spritesheet(this.name,this.image,this.tilewidth,this.tileheight);
			this.setup();
		}.bind(this)
	});

	return this;
};

MapEditor.Tileset.prototype = {

	/* creates the tilsets
	 */
	create : function(){

		this.tileGroup = this.game.add.group();

		var rows= this.imageheight/this.tileheight;
		var cols = this.imagewidth/this.tilewidth;

		var t = cols*rows;
		var x;
		var y;
		var r = 0;
		var c = 0;
		for(var i = 0; i < t; i++){
			if(c >= cols){
				c = 0;
				r++;
			}
			x = c*this.tilewidth;
			y = r*this.tileheight;
			this.tiles[i] = this.game.add.button(x+c, y+r, this.name, this.selectTile, this);
			this.tiles[i].id = i+1;
			this.tiles[i].frame = i;
			this.tileGroup.add(this.tiles[i]);
			c++;
		}

		this.EventEmitter.trigger('tilesetLoaded', [this]);

	},

	destroy : function(){

		if(this.tileGroup){
			this.tileGroup.destroy();
		}

		this.game.destroy();
	},

	/*
	 * Selects the tile
	 */
	selectTile : function(item){
		this.selectedTile = item;
		this.EventEmitter.trigger('tileSelected',[this]);
	},

	setup : function(){
		this.spritesheet.onLoadComplete.add(function(){
			//Don't make the tileset box until the image is loaded
			this.create();
		}, this);
		this.spritesheet.start();
	}
};

MapEditor.Tileset.prototype.constructor = MapEditor.Tileset;

MapEditor.Trigger = function(options){
  options = options || {};
  this.name = options.name || 'tool';
  this.image = options.image || 'tool.png';

  return this;
};

MapEditor.ToolManager  = function(parent){
  this.parent = parent;
  this.EventEmitter = this.parent.EventEmitter;
  this.tools = {};

  return this;
};

MapEditor.ToolManager.prototype = {

  create : function(options){
    console.log(this);
    var t = new MapEditor.Tool(options);
    this.tools[t.id] = t;
    //this.events.triggerCreated.dispatch(t);
    this.EventEmitter.trigger('toolCreated', t);
  }
};

MapEditor.ToolManager.prototype.constructor = MapEditor.ToolManager;

MapEditor.Trigger = function(options){
	options = options || {};
	this.id = options.id || $uid();
	this.name = options.name || 'trigger';
	this.type = options.type || 'sprite'; //sprite,off
	this.location = options.location || {x:0,y:0};//location
	this.tileId = options.tileId || 0;
	this.sprite = options.sprite || '';//if sprite is null then it is an invisible sprit
	this.width = options.width || '32';
	this.height = options.height || '32';
	this.layer = options.layer || '0';
	this.triggeredBy = options.triggeredBy || 'collide'; //collide, spriteCollide, action, trigger (ones that are called by trigger don't have a location)
	this.actionType = options.actionType || 'addSprite'; //addSprite,removeSprite,moveSprite,animateSprite,showLayer,hideLayer, customCode
	this.impactItem = options.impactItem || 'triggeredSprite';//this needs to be a sprite or a layer determined by "this.actionType" not used for customCode //this is the item impacted by trigger
	this.onComplete = options.onComplete || '';//'',{action : callTrigger, trigger : trigername || id} , {action : callCode, code : function to run}

	return this;
};

MapEditor.TriggerManager  = function(parent){
	this.parent = parent;
	this.EventEmitter = this.parent.EventEmitter;
	this.triggers = {};
	return this;

};

MapEditor.TriggerManager.prototype = {

	create : function(options){

		var t = new MapEditor.Trigger(options);
		this.triggers[t.id] = t;

	}
};
MapEditor.TriggerManager.prototype.constructor = MapEditor.TriggerManager;

//# sourceMappingURL=MapEditor.combined.js.map