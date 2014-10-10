Phaser.Plugin.LevelEditor = function (game) {
  this.game = game;
  Phaser.Plugin.call(this, game);
	this.game.le = this;
 // return this;
}

Phaser.Plugin.LevelEditor.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.LevelEditor.prototype.constructor = Phaser.Plugin.LevelEditor;

Phaser.Plugin.LevelEditor.prototype.create = function(name, grid, tiles){
  this.name = name || 'New Level';
  this.grid = game.add.leGrid(grid);
}
