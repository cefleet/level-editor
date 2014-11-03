LevelEditor = function (containers) {
	containers = containers || {};
	this.mainContainer = containers.main || '';
	this.gridContainer = containers.grid ||'';
	this.tilesetContainer = containers.tileset ||'';
	this.map = {};
}

LevelEditor.prototype.constructor = LevelEditor;

LevelEditor.funcs = {
		create : function(name,grid,tileset, id){	
			this.destroy();
			this.map = {};
			//Mkaes the componants
			grid = grid || {};
			grid.container = grid.container || this.gridContainer;			
			this.grid = new LevelEditor.Grid(grid);
			
			tileset = tileset || {};
			tileset.container = tileset.container || this.tilesetContainer;
			this.tileset = new LevelEditor.Tileset(tileset);
			
			//listeners for cross object communication
			//This is correct because Level Editor should be the 'glue' between the two
			this.tileset.events.tileSelected.add(this.grid.setMarker, this.grid);  
			this.tileset.events.tilesetImageLoaded.add(this.grid.loadTileset, this.grid); 
			 
			//ads in some settings
			this.map.name =  name || 'My Map';
			this.map.id = id || $uid();
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
		
		//TODO sort by the layers z index
		//into a temp array so they can be placed in this array in order
		var tempArr = [];
		for(var l in this.grid.layers){
			tempArr.push([l,this.grid.layers[l].order]);
		}		
		tempArr.sort(function(a,b){return a[1]-b[1]});
		var mapLayers = {};
		//for(var l in this.grid.layers){
		for(var i = 0; i < tempArr.length; i++){
			//tempArr[i][0] should be the id
			var l = tempArr[i][0];
			var layer = this.grid.layers[l];
			var ar = [];
			
			for(var t in layer.tiles){
				ar.push(layer.tiles[t].tilesetId);
			}
			
			layers.push({
					data : ar,
					height : Number(this.grid.tilesy),
					name : l,
					opacity : 1,
					type : 'tilelayer',
					visible : true,
					width: Number(this.grid.tilesx),
					x : 0,
					y: 0
				});
				
				mapLayers[l] = {
					id : l,
					name : layer.name,
					order : layer.order
				}
		}
		
		var json = {
			height : Number(this.grid.tilesy),
			width: Number(this.grid.tilesx),
			layers  : layers,
		
			//TODO possibly of combining tilesets
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
		}		
		
		this.map.tilemap = json;
		this.map.layers = mapLayers;
		this.map.tilesetId = this.tileset.id;
		
		return this.map;
	},
	

	load : function(map){
		if(typeof map.tilemap === 'string'){
			map.tilemap = JSON.parse(map.tilemap);
		}

		//right here...
		// var tileset = map.tilemap.tilesets[0];		
    
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
		}

		this.create(map.name,grid,tileset,map.id);
		
		this.loadMapData = map;
		
		if(this.tileset.loaded === false	){
			this.tileset.onLoad = this._load.bind(this);
		} else {
			this._load();
		}
	},
	
	/*
	 * This should be in the grid from this point on
	 */
	 
	_load : function() {
		var map = this.loadMapData;

		var layers = map.tilemap.layers;
		this.grid.loadLayers(map);
				
	},
		
	changeSettings : function(){},
	
	launchGame : function(options){
		this.saveMap();
		options.map = this.map;
		options.map.tileset = this.tileset;
		this.grid.destroy();		
		this.tileset.destroy();
		delete this.grid;
		delete this.tileset;
		this.testGame = new LevelEditor.GameTester(options);
		//when it closes we need to destroy the game
	},
	
	destroyGame : function(){
		this.testGame.game.destroy();
		delete this.testGame;
	},
	
	addLayer: function(name, id){
		this.grid.createLayer(name, id);
	},
	
	activateLayer : function(id){
	  this.grid.makeLayerActive(id);
	},
	
	toggleLayerVisibility : function(id){
	  this.grid.toggleLayer(id);
	},
	
	changeLayerName : function(id,newname){
		this.grid.renameLayer(id,newname);
	},
	
	orderLayers : function(order){
		this.grid.orderLayers(order);
	},
	
	deleteLayer : function(id){
		this.grid.deleteLayer(id);
	}
}

Phaser.Utils.extend( LevelEditor.prototype ,  LevelEditor.funcs );
