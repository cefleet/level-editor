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
LevelEditor.GameTester = function (options) {
	
	options = options || {};
	this.container = options.container;	
	this.width  = options.width || 800;
	this.height = options.height || 600;
    this.map = options.map || {};
    
     //PUT the game into the container
    //setup
    this.game = new Phaser.Game(this.width,this.height, Phaser.CANVAS,this.container, {
		preload : function(){
			//do the loading sstuff here
			//load it here actually
			console.log(this.map);
			//TODO multiple tilesets
			this.game.load.image('sample', this.map.tilemap.tilesets[0].image);
			this.game.cache.addTilemap('tilemap',null, this.map.tilemap, Phaser.Tilemap.TILED_JSON);

		}.bind(this),
		
		create:function(){
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.setScreenSize();
			this.game.physics.startSystem(Phaser.Physics.P2JS);
			this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, '');
			this.game.physics.p2.enable(this.player);
			this.cursors = this.game.input.keyboard.createCursorKeys();
			this.game.camera.follow(this.player);
			this.setup();		
		}.bind(this),
		
		update : function(){
			this.update();
		}.bind(this)
	});
    
	return this;
}

LevelEditor.GameTester.prototype = {
	setup : function(){
		var tilemap = this.game.add.tilemap('tilemap');
		tilemap.addTilesetImage('sample');
		//TODO multiple layers
		var layer = tilemap.createLayer(this.map.tilemap.layers[0].name);
		layer.resizeWorld();
	},
	
	update : function(){
		//This could be a movement function and the 300 could be a speed variable
		this.player.body.setZeroVelocity();
		if (this.cursors.up.isDown){
			this.player.body.moveUp(300)
		} else if (this.cursors.down.isDown){
			this.player.body.moveDown(300);
		}
		if (this.cursors.left.isDown){
			this.player.body.velocity.x = -300;
		} else if (this.cursors.right.isDown){
			this.player.body.moveRight(300);
		}
	}
}
