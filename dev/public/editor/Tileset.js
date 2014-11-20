LevelEditor.Tileset = function (options) {
	//With these changes
	options = options || {};
	this.container = options.container;
	this.image  = options.image || 'img/sampletileset.png';
	this.name = options.name || 'tiles';
	this.imageheight = options.imageheight || 256;
	this.imagewidth = options.imagewidth || 256;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.collisionTiles = options.collisionTiles ||  [0,1,[2-23]]; //this is purposlly writtein to show that it can be an array of number or an array of arrays sets or a mixture
    this.tiles = {};
    this.bgColor = options.bgColor || {
		line : 0x2F2F2F,
		fill : 0x9C9C9C
	};
	this.loaded = false;
	this.events = {
		tilesetImageLoaded : new Phaser.Signal(),
		tileSelected : new Phaser.Signal(),
		gameCreated  : new Phaser.Signal()
	};
	
	if(!options.id) {
	  console.log('There seems to be a problem with the option id');
	} else {
		console.log(options.id);
		this.id = options.id;
	}

	//this.id = options.id || $uid();
	
	this.game = new Phaser.Game(this.imagewidth+(this.imagewidth/this.tilewidth),this.imageheight+(this.imageheight/this.tileheight), Phaser.CANVAS,this.container, {
		create:function(){	
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
			this.game.stage.backgroundColor ='#000000';
			this.events.tilesetImageLoaded.dispatch(this);
			this.spritesheet = this.game.load.spritesheet(this.name,this.image,this.tilewidth,this.tileheight);
			this.setup();	
			this.events.gameCreated.dispatch(this);		
		}.bind(this)
	});	

	return this;
};

LevelEditor.Tileset.prototype = {
	
	/* creates the tilsets
	 */
	create : function(){

		this.tileGroup = this.game.add.group();

		
		var rows= this.imageheight/this.tileheight;
		var cols = this.imagewidth/this.tilewidth;  
  
		var t = cols*rows;
		var x;
		var y;
		var r = 0;		
		var c = 0;
		for(var i = 0; i < t; i++){ 
			if(c >= cols){
				c = 0;
				r++;
			}
			x = c*this.tilewidth;
			y = r*this.tileheight;
			this.tiles[i] = this.game.add.button(x+c, y+r, this.name, this.selectTile, this);
			this.tiles[i].id = i+1;
			this.tiles[i].frame = i;
			this.tileGroup.add(this.tiles[i]);
			c++;
		}
		this.loaded = true;	
		this.onLoad();
	},
	
	destroy : function(){
		
		if(this.tileGroup){
			this.tileGroup.destroy();
		}			
		
		this.game.destroy();
	},
	
	/*
	 * Selects the tile
	 */
	selectTile : function(item){
		this.selectedTile = item;
		this.events.tileSelected.dispatch(this);
	},
	
	/*
	 * run once loaded. Should be overwritten
	 * kinda gheto hqackish
	 */
	onLoad : function(){
		
	},
	
	setup : function(){
		this.spritesheet.onLoadComplete.add(function(){
			//Don't make the tileset box until the image is loaded		
			this.create();
		}, this);
		this.spritesheet.start();
	}
};

LevelEditor.Tileset.prototype.constructor = LevelEditor.Tileset;
