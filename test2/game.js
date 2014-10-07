var game = new Phaser.Game(1200,800, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});


function preload(){
	//game.load.spritesheet(tileset.name,grid.settings.tilesetImage,grid.settings.tilewidth,grid.settings.tileheight);
	game.load.image('tiles','tileset5.png');
}


function create(){	
	
}


function update(){	
}

function makeMap(json){
	game.cache.addTilemap('map',null, json, Phaser.Tilemap.TILED_JSON);
	map = game.add.tilemap('map');
	map.addTilesetImage('tiles');
	var layer = map.createLayer('layer');
}
