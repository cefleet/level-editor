Phaser.Plugin.LevelEditor.Grid = function (game, tileset, width, height, tileWidth, tileHeight) {
  this.game = game;
  this.tileset = tileset || '';
  this.width = width || 12;
  this.height = height || 12;
  this.tileWidth = tileWidth || 32;
  this.tileHeight = tileHeight || 32;
  
  return this;
}

Phaser.Plugin.LevelEditor.Grid.prototype.constructor = Phaser.Plugin.Grid;

Phaser.GameObjectCreator.prototype.leGrid = function (tileset,width,height,tileWidth,tileHeight) {

    return new Phaser.Plugin.LevelEditor.leGrid(this.game,tileset,width,height,tileWidth,tileHeight);

};


Phaser.GameObjectFactory.prototype.leGrid = function (tileset,width,height,tileWidth,tileHeight,group) {

    var t = new Phaser.Plugin.LevelEditor.Grid(this.game,tileset,width,height,tileWidth,tileHeight);
    return t;

};
