Phaser.Plugin.LevelEditor.Grid = function (game, options) {
	this.game = game;	  
	options = options || {};
	this.linecolor = options.line || 0x000000;
	this.fillcolor = options.fill || 0x545454;
	this.loc = options.loc || [0,0];
	this.activeTileOp = 0;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.tilesy = options.tilesy || 16;
	this.tilesx = options.tilesx || 18;
    this.tiles = {};
    this.marker = game.add.sprite(0,0,'');
    this.marker.tilesetId = 0;
    
	return this;
}

Phaser.Plugin.LevelEditor.Grid.prototype = {
	
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
		this.activeTile.sprite = game.add.sprite(this.marker.x,this.marker.y,this.marker.key,this.marker.frame);
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
	}		
};

Phaser.Plugin.LevelEditor.Grid.prototype.constructor = Phaser.Plugin.LevelEditor.Grid;

Phaser.GameObjectCreator.prototype.leGrid = function (options) {

    return new Phaser.Plugin.LevelEditor.leGrid(this.game,options);

};


Phaser.GameObjectFactory.prototype.leGrid = function (options) {

    var t = new Phaser.Plugin.LevelEditor.Grid(this.game,options);
    t.makeTiles();
    t.drawGrid();
    return t;
};
