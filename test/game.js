var game = new Phaser.Game(1200,800, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});
var game = new Phaser.Game(1200,800, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});
function preload(){
  game.plugins.add(new Phaser.Plugin.LevelEditor(game));
}

function create(){
  game.le.create();
}

function update(){

}
