Phaser.Plugin.LevelEditor = function (game) {
  this.game = game;
  Phaser.Plugin.call(this, game);
	this.game.le = this;
 // return this;
}

Phaser.Plugin.LevelEditor.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.LevelEditor.prototype.constructor = Phaser.Plugin.LevelEditor;

Phaser.Plugin.LevelEditor.prototype.create = function(name, tileset, width, height, tileWidth, tileHeight){
  this.name = name || 'New Level';
  this.tileset = tileset || '';
  this.width = width;
  this.height = height;
  this.tilewidth = tileWidth;
  this.tileheight = tileHeight;
  this.grid = game.add.leGrid(this.tileset,this.width,this.height,this.tileWidth,this.tileHeight);
}
