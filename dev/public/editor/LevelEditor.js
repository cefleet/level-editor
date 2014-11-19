LevelEditor = function (containers) {
	containers = containers || {};
	this.mainContainer = containers.main || '';
	this.gridContainer = containers.grid ||'';
	this.tilesetContainer = containers.tileset ||'';
	this.map = {};
	this.events = {
	  mapSaved : new Phaser.Signal()
	}
}

LevelEditor.prototype.constructor = LevelEditor;

LevelEditor.funcs = {
		create : function(name,grid,tileset, id){	
			this.destroy();
			this.map = {};
			//Mkaes the componants
			
			
			tileset = tileset || {};
			tileset.container = tileset.container || this.tilesetContainer;
			this.tileset = new LevelEditor.Tileset(tileset);
			
			//listeners for cross object communication
			//This is correct because Level Editor should be the 'glue' between the two
			//this.tileset.events.tilesetImageLoaded.add(this.grid.loadTileset, this.grid); 
			grid = grid || {};
			grid.container = grid.container || this.gridContainer;			
			this.grid = new LevelEditor.Grid(grid);
				
			this.grid.events.gameCreated.add(function(){
				
				this.grid.loadTileset(this.tileset);
					
				this.tileset.events.tileSelected.add(this.grid.setMarker, this.grid);  
			
				this.grid.events.toolChanged.add(GameMaker.UI.Actions._activateTool);	
						
				this.grid.events.layerAdded.add(function(o){
					GameMaker.UI.Actions.createNewLayerUI(o.name,o.id);
				});
			
			}, this);		
			//We can have a go between here so phaser events don't mesh with other events
			
			this.triggerManager = new LevelEditor.TriggerManager();
			this.spriteManager = new LevelEditor.SpriteManager();
			
			this.grid.events.triggerPlaced.add(function(loc){
			  GameMaker.UI.Actions.createNewTriggerPopup();
			});
			
			this.grid.events.spritePlaced.add(function(loc){
			  GameMaker.UI.Actions.createNewSpritePopup();
			});
						
			this.events.mapSaved.add(GameMaker.UI.Actions._saveMap);
			
			
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
		
		this.events.mapSaved.dispatch(this.map);
	//	return this.map;
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
		}

		this.create(map.name,grid,tileset,map.id);
		
		//the create has already made the grid		
		this.grid.events.tilesetLoaded.add(function(){
				this.grid.loadLayers(map);	
		}, this);
		//this.loadMapData = map;
		
		//TODO this is waiting o nthe wrong thing
		/*
		if(this.tileset.loaded === false	){
			this.tileset.onLoad = this._load.bind(this);
		} else {
			this._load();
		}
		*/
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
	},
	
	setTool : function(tool){
	  this.grid.setToolType(tool);
	}
}

Phaser.Utils.extend( LevelEditor.prototype ,  LevelEditor.funcs );
