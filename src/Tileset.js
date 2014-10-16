Phaser.Plugin.LevelEditor.Tileset = function (game, options) {
	this.game = game;	  
	options = options || {};
	this.image  = options.image || 'tileset.png';
	this.name = options.name || 'tiles';
	this.imageheight = options.imageheight || 265;
	this.imagewidth = options.imagewidth || 256;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.collisionTiles = options.collisionTiles ||  [0,1,[2,23]]; //this is purposlly writtein to show that it can be an array of number or an array of arrays sets or a mixture
    this.tiles = {};
    this.bgColor = options.bgColor || {
		line : 0x2F2F2F,
		fill : 0x9C9C9C
	};
	
	this.events = {
		tileSelected : new Phaser.Signal()
	}
	
	this.spritesheet = this.game.load.spritesheet(this.name,this.image,this.tilewidth,this.tileheight);
	
	return this;
}

Phaser.Plugin.LevelEditor.Tileset.prototype = {
	/*
	 * Makes the window BG
	 */
	 
	makeWindow : function(){
		this.bg = this.game.add.graphics(0, 0);
		this.bg.lineStyle(1, this.bgColor.line, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
		this.bg.beginFill(this.bgColor.fill, 1);
		
		var x = window.innerWidth - this.tilewidth*6;	
		var y = 60;  
	
		//odd arbitary numbers here
		this.bg.drawRect(x-20,y-20, (this.tilewidth+6)*5, (this.tileheight+4)*17);	
	},
	
	/* creates the tilsets
	 */
	create : function(){
		this.makeWindow();
		this.tileGroup = this.game.add.group();
		this.tileGroup.add(this.bg);
		
		var cols = this.imageheight/this.tileheight;
		var rows = this.imagewidth/this.tilewidth;  
  
		var i = 0;
		var c = 0;
		var yo = 60;
		var xo = window.innerWidth - this.tilewidth*6; // this is no correct I should do some math here to see how many rows there wold be
		var y = yo;
		var x = xo;
		var yoff = 0;
		var xoff = this.tilewidth+6;
		var r;
		
		while(c <= cols-1){
			r = 0;
			while(r <= rows-1){
				if(yoff >=16){
					yoff = 0;
					x += xoff;
				}
				y = this.tileheight*(yoff+1)+yoff*2+yo;
				this.tiles[i] = game.add.button(x, y, this.name, this.selectTile, this);
				this.tiles[i].id = i+1;
				this.tiles[i].frame = i;
				this.tileGroup.add(this.tiles[i]);
				yoff++;
				r++;
				i++;
			}
			c++;
		}	
	},
	
	/*
	 * Selects the tile
	 */
	selectTile : function(item){
		this.selectedTile = item;
		this.events.tileSelected.dispatch(this);
	}
}

Phaser.Plugin.LevelEditor.Tileset.prototype.constructor = Phaser.Plugin.LevelEditor.Tileset;

Phaser.GameObjectCreator.prototype.leTileset = function (options) {

    return new Phaser.Plugin.LevelEditor.leTileset(this.game,options);

};


Phaser.GameObjectFactory.prototype.leTileset = function (options) {
	//makes a new tileset
    var t = new Phaser.Plugin.LevelEditor.Tileset(this.game,options);
    
    //when the tileset image loads do this
	t.spritesheet.onLoadComplete.add(function(){
		//Don't make the tileset box until the image is loaded		
		this.create();
	}, t);
	//start the upload
    t.spritesheet.start();
	return t;
 
};
