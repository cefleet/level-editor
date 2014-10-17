Phaser.Plugin.LevelEditor = function (game) {
  this.game = game;
  Phaser.Plugin.call(this, game);
	this.game.le = this;
	this.map = {};
	/*
	this.storedData = JSON.parse(localStorage.getItem('LevelEditor'));
	if(!this.storedData){
		this.storedData ={
			Maps : {},
			DefaultSettings : {
				name : 'My Map',
				height : '16',
				width : '16',
				tileset : 'tileset.png'
			}
		}
	}
	*/
	
}

Phaser.Plugin.LevelEditor.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.LevelEditor.prototype.constructor = Phaser.Plugin.LevelEditor;

 Phaser.Plugin.LevelEditor.funcs = {
		create : function(name,grid,tileset, id){	

		//Mkaes the componants
			this.grid = this.game.add.leGrid(grid);
			this.tileset = this.game.add.leTileset(tileset);
	
			//listeners for cross object communication
			this.tileset.events.tileSelected.add(this.setMarker, this);
  
			//Mouse movements
			this.setupMouseForGrid();
 
			//ads in some settings
			this.map.name =  name || 'My Map';
			this.map.id = id || game.rnd.uuid();
		},
	
		destroy : function(){
			this.map = {};
			this.grid.gridImage.destroy();
			this.tileset.bg.destroy();
		},
	/*
	* Sets the marker from the signal given from the tileset
	*/
	setMarker : function(t){
		this.grid.marker.destroy();	
		this.grid.marker = this.game.add.sprite(0,0, t.name, t.selectedTile.frame*1);
		this.grid.marker.tilesetId = t.selectedTile.id;
	},
	
	/*
	* Sets up Mouse actions
	*/
	setupMouseForGrid : function(){
		this.game.input.mouse.mouseMoveCallback = function(c){
			if(this.grid.inGrid(c)){
				this.grid.setActiveTileFromPoint(c);
				if(this.game.input.activePointer.isDown){
					if(c.which === 3){
						this.grid.unsetActiveTile();
					} else if(c.which === 1) {
						this.grid.setActiveTileFromMarker();
					}
				}
			}
		}.bind(this);
	
		this.game.input.mouse.mouseDownCallback = function(c){
			if(this.grid.inGrid(c)){
				this.grid.setActiveTileFromPoint(c);
				if(c.which === 3){
					this.grid.unsetActiveTile();
				} else if(c.which === 1){
					this.grid.setActiveTileFromMarker();
				}
			}
		}.bind(this);
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
			height : this.grid.tilesy,
			width: this.grid.tilesx,
			layers  : [
				{
					data : ar,
					height : this.grid.tilesy,
					name : this.name,
					opacity : 1,
					type : 'tilelayer',
					visible : true,
					width: this.grid.tilesx,
					x : 0,
					y: 0
				}
			],
			//TODO possibly of combining tilesets
			tilesets : [
				{
					firstgid : 1,
					image : this.tileset.image,
					imageheight : this.tileset.imageheight,
					imagewidth : this.tileset.imagewidth,
					margin : 0,
					name : this.tileset.name,
					spacing : 0,
					tileheight: this.tileset.tileheight,
					tilewidth : this.tileset.tilewidth				
				}
			],
			orientation:"orthogonal",
			tileheight : this.tileset.tileheight,
			tilewidth:this.tileset.tilewidth,
			version :1		
		}		
		
		this.map.tilemap = json;
		return this.map;
	},
	
	//For now this just loads a single layer
	load : function(map){	
		
		var data = map.tilemap.layers[0].data;
		
		for(var i = 0; i < data.length; i++){
			var id = data[i];
			var t = this.grid.tiles[i];
			t.tilesetId = id;
			if(id != 0){
				//frame starts with 0 first item
				t.sprite = game.add.sprite(t.x,t.y,this.tileset.name, this.tileset.tiles[id-1].frame);
			}
		}
		
		this.map.id = map.id;
		this.map.name = map.name;
		//add more settings later		
	},
		
	changeSettings : function(){}	
}

Phaser.Utils.extend( Phaser.Plugin.LevelEditor.prototype ,  Phaser.Plugin.LevelEditor.funcs );
