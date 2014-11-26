Game.GameTester = function (options) {
	options = options || {};
	this.container = options.container;	
	this.width  = options.width || 800;
	this.height = options.height || 600;
	this.map = options.map || {};
    
     //PUT the game into the container
    //setup
    this.game = new Phaser.Game(this.width,this.height, Phaser.CANVAS,this.container, {
		preload : function(){
			
			if(typeof this.map.tilemap === 'string'){
			  this.map.tilemap = JSON.parse(this.map.tilemap);
			}
			
			this.game.load.image(this.map.tilemap.tilesets[0].name, this.map.tilemap.tilesets[0].image);
			this.game.cache.addTilemap('tilemap',null, this.map.tilemap, Phaser.Tilemap.TILED_JSON);			

			this.game.load.spritesheet('player', 'img/player.png',80,80);

		}.bind(this),
		
		create:function(){

			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.setScreenSize();
			
			this.tilemap = this.game.add.tilemap('tilemap');
			this.tilemap.addTilesetImage(this.map.tilemap.tilesets[0].name);
		
			//TODO: multiple layers
			this.layers = [];
			for(var i = 0; i < this.map.tilemap.layers.length; i++){

				this.layers.push(this.tilemap.createLayer(this.map.tilemap.layers[i].name));      
				
				if(this.map.tileset.collisionTiles){		  
					for(var j = 0; j < this.map.tileset.collisionTiles.length; j++){
						//This needs a lot of help .. but it should work for now
						if(isNaN(Number(this.map.tileset.collisionTiles[j]))){
							var ar = this.map.tileset.collisionTiles[j].split('-');
							this.tilemap.setCollisionBetween(ar[0],ar[1],true,this.layers[i]);
						}
					}
				}
				//Have no clue why I neededto do this
			//	this.layers[i].fixedToCamera = false;		  		 
			}
		
		this.layers[0].resizeWorld();//all the layers are the same size so just do it on the last layer
			
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.player = this.game.add.sprite(100, 100, 'player');
			this.game.physics.arcade.enable(this.player);
			this.player.body.collideWorldBounds = true;

			//animations here
			this.player.animations.add('moveleft',[7,8,7,6], 6);
			//RIGHT
			this.player.animations.add('moveright',[1,2,1,0], 6);
			//UP
			this.player.animations.add('moveup',[19,20,19,18], 6);
			//DOWN
			this.player.animations.add('movedown',[13,14,13,12], 6);

			this.cursors = this.game.input.keyboard.createCursorKeys();
			this.game.camera.follow(this.player);
			this.game.time.advancedTiming = true;
			
			
		this.game.world.bringToTop(this.player);
		
		}.bind(this),
		
		update : function(){
			this.update();
		}.bind(this),
		
		render : function(){
			this.game.debug.text('FPS : '+this.game.time.fps, 10,10);
		}.bind(this)
	});
    
	return this;
};

Game.GameTester.prototype = {
		
	update : function(){
	
	  for(var i = 0; i < this.layers.length; i++){
	    this.game.physics.arcade.collide(this.player, this.layers[i]);
	  }

		this.player.body.velocity.set(0);
		var moving = false;
		if (this.cursors.up.isDown){
			moving = true;
			this.player.body.velocity.y = -300;
			this.player.animations.play('moveup');
		} else if (this.cursors.down.isDown){
			moving = true;
			this.player.body.velocity.y = 300;
			this.player.animations.play('movedown');
		}
		if (this.cursors.left.isDown){
			moving = true;
			this.player.body.velocity.x = -300;
			this.player.animations.play('moveleft');

		} else if (this.cursors.right.isDown){
			moving = true;
			this.player.body.velocity.x = 300;
			this.player.animations.play('moveright');
		}
		
		if(moving === false){
			this.player.animations.stop();
		}
	}
};
