/* This doesnt do anythign yet. Just wanted to keep this functio nhere
testMap : function(){
		this.saveMap();
		console.log(JSON.stringify(this.map.tilemap));
		this.game.cache.addTilemap('map',null, this.map.tilemap, Phaser.Tilemap.TILED_JSON);
		this.destroy();
		map = this.game.add.tilemap('map');
		map.addTilesetImage('sample');
		var layer = map.createLayer('layer');
		layer.resizeWorld();		
	}	
	*/
