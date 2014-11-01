LevelEditor.Grid = function (options) {
	
	options = options || {};
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
	this.scale =1;
	this.baseHeight = this.tilesy*this.tileheight;
	this.baseWidth = this.tilesx*this.tilewidth;
	
  //  this.tiles = {}; 
        
    //setup
    this.game = new Phaser.Game(this.tilewidth*this.tilesx,this.tileheight*this.tilesy, Phaser.CANVAS,this.container, {
		create:function(){
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.setScreenSize();
			this.game.stage.backgroundColor ='#545454'; //''
			this.setup();		
		}.bind(this)
	});
    
	return this;
}

LevelEditor.Grid.prototype = {
	
	setup : function(){
		this.getContainerOffset();
		this.drawGrid();
		this.setupMouse();
		this.marker = this.game.add.sprite(0,0,'');
		this.marker.tilesetId = 0;		
		this.layers ={};
		
		/* Need to decide to create this or not*/
		this.createLayer('base', 1);
		this.makeLayerActive('base');
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
				}
				c++;
				i++;
			}
			r++;
		}
	},
	
	loadLayers : function(layers){
		this.layers ={};// this effictivly deletes the "base" layer that was added on create. There would not be anything in it so it shouldn't hurt anything
		for(var j = 0; j < layers.length; j++){
			this.loadLayer(layers[j]);
		}
		this.makeLayerActive(layers[0].name);	
	},
	
	loadLayer : function(layer){
		this.createLayer(layer.name);
		var data = layer.data;
		for(var i = 0; i < data.length; i++){
			var id = data[i];
			var t = this.layers[layer.name].tiles[i];
			t.tilesetId = id;
			if(id != 0){				
				//frame starts with 0 first item
				if(LE.tileset.tiles[id-1]){
					t.sprite = this.game.add.sprite(t.x,t.y,LE.tileset.name, LE.tileset.tiles[id-1].frame);
					this.layers[layer.name].add(t.sprite);
				}
			}
		}
	},
	
	/*
	 * Creates a layer... possible even have a layer class in the future
	 */
	createLayer : function(name, level){
		//Don't really know how to implement the level yet but I will figure it iout
		this.layers[name] = this.game.add.group();
		this.layers[name].tiles = {};
		this.makeTiles(this.layers[name]);
		this.makeLayerActive(this.layers[name]);
	},
	  
	//make layer active
	makeLayerActive : function(layer){
		if(typeof layer === 'string'){
			layer = this.layers[layer];
		}
		this.activeLayer = layer;
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
			}
			if(this.inGrid(p)){
				this.setActiveTileFromPoint(p);
				if(this.game.input.activePointer.isDown){
					if(c.which === 3){
						this.unsetActiveTile();
					} else if(c.which === 1) {
						this.setActiveTileFromMarker();
					}
				}
			}
		}.bind(this);
	
		this.game.input.mouse.mouseDownCallback = function(c){
			var p = {
				x : c.offsetX/this.scale,
				y : c.offsetY/this.scale
			}
			if(this.inGrid(p)){
				this.setActiveTileFromPoint(p);
				if(c.which === 3){
					this.unsetActiveTile();
				} else if(c.which === 1){
					this.setActiveTileFromMarker();
				}
			}
		}.bind(this);
	},
	
	destroy : function(){
		for(g in this.layers){
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
	
	loadTileset : function(t){
		this.spritesheet = this.game.load.spritesheet(t.name,t.image,t.tilewidth,t.tileheight);
		this.spritesheet.onLoadComplete.add(function(){
			//Don't make the tileset box until the image is loaded	
		}, this);
		this.spritesheet.start();
	},
	
	setMarker : function(t){
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
	
	getContainerOffset : function(){
		//this breaks some of the game aspect 
		if(this.container) {
			var e = document.getElementById(this.container);
			var o = e.getBoundingClientRect();
			this.offsetx = o.left;
			this.offsety = o.top;
		}
	},
	
	scaleTo : function(scale){
			//scale is a # that is a %
			var decScale = Number(scale)/100;
			this.game.scale.maxWidth = this.baseWidth*decScale;
			this.game.scale.maxHeight = this.baseHeight*decScale;
			this.game.scale.refresh();
			this.scale = decScale;
	}
};

LevelEditor.Grid.prototype.constructor = LevelEditor.Grid;
