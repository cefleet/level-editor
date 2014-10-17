var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});

function preload(){
	game.plugins.add(new Phaser.Plugin.LevelEditor(game));
};


function create(){
	
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	game.stage.backgroundColor ='#3F5465';
		
};

function update(){
	
}
