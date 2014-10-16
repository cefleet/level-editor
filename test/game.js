var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});

function preload(){
	game.plugins.add(new Phaser.Plugin.LevelEditor(game));
};


function create(){
	//Creates the Level Editor
	var grid = {loc : [100,100]};
	var tiles = {name:'tiles'};
	game.le.create('My Level',grid,tiles);
	
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	game.stage.backgroundColor ='#3F5465';
		
};

function update(){
	
}
