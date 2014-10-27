LevelEditor.Grid = function (options) {
	
	options = options || {};
	this.container = options.container;
	this.linecolor = options.line || 0x000000;
	this.fillcolor = options.fill || 0x545454;
	this.loc = options.loc || [0,0];
	this.activeTileOp = 0;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.tilesy = options.tilesy || 16;
	this.tilesx = options.tilesx || 18;
	this.offsetx = 0;
	this.offsety = 0;
	this.scaley = 1;
	this.scalex = 1;
    this.tiles = {};
        
        
    //setup
    this.game = new Phaser.Game(this.tilewidth*this.tilesx,this.tileheight*this.tilesy, Phaser.CANVAS,this.container, {
		create:function(){	
			this.game.stage.backgroundColor ='#545454';
			this.setup();		
		}.bind(this)
	});
    
	return this;
}

LevelEditor.Grid.prototype = {
	
	setup : function(){
		this.getContainerOffset();
		this.makeTiles();
		this.drawGrid();
		this.setupMouse();
		this.marker = this.game.add.sprite(0,0,'');
		this.marker.tilesetId = 0;
	},
	
	/*
	 * Draws the grid
	 */	 
	drawGrid : function(){
	  
		this.gridImage = this.game.add.graphics(0, 0);  //init rect
		this.gridImage.lineStyle(1, this.linecolor, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
		this.gridImage.beginFill(this.fillcolor, 1);
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
	makeTiles : function(){
		var r = 0;	
		var i = 0;
		while(r < this.tilesy){
			var c = 0;
			while(c < this.tilesx){
				this.tiles[i] = {
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
	
	/*
	 * Returns the tile under the point (Point does not haveto be a real point it just an object with properties of x, y)
	 */
	getTileFromPoint : function(point){
		for(var tile in this.tiles){
			var t = this.tiles[tile];
			if(point.x > t.x && point.x < t.x+this.tilewidth && point.y > t.y && point.y < t.y+this.tileheight){
				return t;
			}
		}
	},
	
	/*
	 * Sets the active Tile
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
				x : c.offsetX,
				y : c.offsetY
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
				x : c.offsetX,
				y : c.offsetY
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
		for(t in this.tiles){
			if(this.tiles[t].sprite) {
				this.tiles[t].sprite.destroy();
			}
		}
		if(this.gridImage){
			this.gridImage.destroy();
		}
		
		this.game.input.mouse.mouseMoveCallback = function(){};
		this.game.input.mouse.mouseDownCallback = function(){};
		this.game.destroy();
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
	}
};

LevelEditor.Grid.prototype.constructor = LevelEditor.Grid;
