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
  return this;
}

Phaser.Plugin.LevelEditor.Grid.prototype = {

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
				  tileId : 0
			  }
			  c++;
			  i++;
		  }
		  r++;
	  }
  }
};

Phaser.Plugin.LevelEditor.Grid.prototype.constructor = Phaser.Plugin.LevelEditor.Grid;

Phaser.GameObjectCreator.prototype.leGrid = function (options) {

    return new Phaser.Plugin.LevelEditor.leGrid(this.game,options);

};


Phaser.GameObjectFactory.prototype.leGrid = function (options) {

    var t = new Phaser.Plugin.LevelEditor.Grid(this.game,options);
  //  t.makeTiles();
    t.drawGrid();
    return t;

};
