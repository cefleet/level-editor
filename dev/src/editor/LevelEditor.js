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
		var ar = [];
		for(var t in this.grid.tiles){
			ar.push(this.grid.tiles[t].tilesetId);
		}
		var json = {
			height : Number(this.grid.tilesy),
			width: Number(this.grid.tilesx),
			layers  : [
				{
					data : ar,
					height : Number(this.grid.tilesy),
					name : 'layer',//TODO this is bad
					opacity : 1,
					type : 'tilelayer',
					visible : true,
					width: Number(this.grid.tilesx),
					x : 0,
					y: 0
				}
			],
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
		return this.map;
	},
	
	//For now this just loads a single layer
	load : function(map){
		
		var tileset = map.tilemap.tilesets[0];		
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
	
	_load : function() {
		var map = this.loadMapData;
		var data = map.tilemap.layers[0].data;
		for(var i = 0; i < data.length; i++){
			var id = data[i];
			var t = this.grid.tiles[i];
			t.tilesetId = id;
			if(id != 0){
				//frame starts with 0 first item
				if(this.tileset.tiles[id-1]){
					t.sprite = this.grid.game.add.sprite(t.x,t.y,this.tileset.name, this.tileset.tiles[id-1].frame);
				}
			}
		}
	},
		
	changeSettings : function(){},
	
	launchGame : function(options){
		this.saveMap();
		options.map = this.map;
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
	}
}

Phaser.Utils.extend( LevelEditor.prototype ,  LevelEditor.funcs );
