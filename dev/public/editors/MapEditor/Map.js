MapEditor.Map = function (options,parent) {

	options = options || {};

	this.parent = options.parent || parent;
	this.EventEmitter = this.parent.EventEmitter;

	this.container = options.container;
	this.linecolor = options.line || 0x000000;
	this.loc = options.loc || [0,0];
	this.activeTileOp = 0;
	this.tilewidth = options.tilewidth || 32;
	this.tileheight = options.tileheight || 32;
	this.tilesy = options.tilesy || 16;
	this.tilesx = options.tilesx || 18;
	this.offsetx = 0;
	this.offsety = 0;
	this.scale = 1;
	this.baseHeight = this.tilesy*this.tileheight;
	this.baseWidth = this.tilesx*this.tilewidth;
	this.toolType = 'single';

	/*
	this.events = {
		toolChanged : new Phaser.Signal(),
		layerAdded : new Phaser.Signal(),
	};
*/
    //setup
    this.game = new Phaser.Game(this.tilewidth*this.tilesx,this.tileheight*this.tilesy, Phaser.CANVAS,this.container, {

		preload : function(){
			//TODO: this needs to be gotten from the tools section

			//this is a little funky but it's fine for now
			this.game.load.image('eraser', 'img/ui/erase.png');
			//this.game.load.image('single', 'img/ui/single.png');
			this.game.load.image('fill', 'img/ui/fill.png');
			this.game.load.image('select','img/ui/select.png');
			this.game.load.image('trigger','img/ui/trigger.png');
			this.game.load.image('sprite','img/ui/sprite.png');

		},

		create:function(){
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.setScreenSize();
			this.game.stage.backgroundColor ='#545454'; //''
			this.setup();

		}.bind(this)
	});

	this.listenOutFor = [
	{
		event : 'tileSelected',
		action :'setMarkerFromTile'
	},
	{
		event : 'toolChnaged',
		action : 'setToolType'
	},
	{
		event : 'tilesetLoaded',
		action : 'loadTilesetImage'
	},
	{
		event: 'activeLayerSet',
		action : 'setActiveLayer'
	},
	{
		event : 'layerVisibiltySet',
		action : 'toggleLayer'
	}
	];

	this.parent.Intercom.setupListeners(this);
	return this;
};

MapEditor.Map.prototype = {

	setup : function(){
		this.drawGrid();
		this.setupMouse();
		this.marker = this.game.add.sprite(0,0,'');
		this.marker.tilesetId = 0;

		this.layersGroup = this.game.add.group();
		this.EventEmitter.trigger('gridReadyForLayers', [this]);
	},

	/*
	 * Draws the grid
	 */
	drawGrid : function(){

		this.gridImage = this.game.add.graphics(0, 0);  //init rect
		this.gridImage.lineStyle(1, this.linecolor, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
		this.gridImage.drawRect(this.loc[0],this.loc[1], this.tilesx*this.tilewidth,this.tilesy*this.tileheight);

		var r = 0;
		var c = 0;

		while(r <= this.tilesx){
			this.gridImage.moveTo(this.loc[0]+(this.tilewidth*r), this.loc[1]); // x, y
			this.gridImage.lineTo(this.loc[0]+(this.tilewidth*r), this.tileheight*(this.tilesy)+this.loc[1]);
			r++;
		}

		while(c <= this.tilesy){
			this.gridImage.moveTo(this.loc[0], this.loc[1]+(this.tileheight*c)); // x, y
			this.gridImage.lineTo(this.tilewidth*(this.tilesx)+this.loc[0],this.loc[1]+(this.tileheight*c));
			c++;
		}
	},

	toggleLayer : function(layer){

	},

	setActiveLayer : function(layer){
		this.activeLayer = layer;
	},

	
	/*
	 * Returns the tile under the point (Point does not haveto be a real point it just an object with properties of x, y)
	 */
	getTileFromPoint : function(point){
		//Tiles are here
		for(var tile in this.activeLayer.tiles){
			var t = this.activeLayer.tiles[tile];
			if(point.x > t.x && point.x < t.x+this.tilewidth && point.y > t.y && point.y < t.y+this.tileheight){
				return t;
			}
		}
	},

	/*
	 * Sets the active Tile
	 * * This name should be moveMarkerToTileFromPoint
	 */
	setActiveTileFromPoint : function(point){
		var t = this.getTileFromPoint(point);
		if(t){
			this.activeTile = t;
			this.marker.x = t.x;
			this.marker.y = t.y;
		}
		return this.activeTile;
	},

	/*
	 * Uses the activeTile to set the tileset ID

	 */
	setTileIdOfActiveTileFromMarker : function(){
		this.activeTile.tilesetId = this.marker.tilesetId;
	},

	/*
	 * Uses the active tile and marker sprite to place a sprite on the
	 */
	setSpriteOfActiveTileFromMarker : function(){
		this.activeTile.sprite = this.game.add.sprite(this.marker.x,this.marker.y,this.marker.key,this.marker.frame);
		this.activeLayer.add(this.activeTile.sprite);
	},

	/*
	 * combines the id and sprite
	 */
	setActiveTileFromMarker : function(){
		this.unsetActiveTile();
		this.setTileIdOfActiveTileFromMarker();
		this.setSpriteOfActiveTileFromMarker();
	},
	/*
	 * Unsets the active tile
	 */
	unsetActiveTile : function(){
		if(this.activeTile){
			if(this.activeTile.sprite){
				this.activeTile.sprite.destroy();
			}
		}

		this.activeTile.tilesetId = 0;
	},

	setupMouse : function(){
		this.game.input.mouse.mouseMoveCallback = function(c){
			var p = {
				x : c.offsetX/this.scale,
				y : c.offsetY/this.scale
			};

			if(this.inGrid(p)){
				this.setActiveTileFromPoint(p);
				if(this.game.input.activePointer.isDown){

					if(c.which === 1){

						if(this.toolType === 'eraser'){
							this.unsetActiveTile();
						} else if(this.toolType === 'single') {
							this.setActiveTileFromMarker();
						}

					}
				}
			}
		}.bind(this);

		this.game.input.mouse.mouseDownCallback = function(c){
			var p = {
				x : c.offsetX/this.scale,
				y : c.offsetY/this.scale
			};
			if(this.inGrid(p)){
				this.setActiveTileFromPoint(p);

				if(c.which === 1){

						if(this.toolType === 'eraser'){
							this.unsetActiveTile();
						} else if(this.toolType === 'single') {
							this.setActiveTileFromMarker();
						} else if (this.toolType === 'trigger'){
							this.placeTrigger();
						} else if(this.toolType === 'sprite'){
							this.placeSprite();
						}
				}
			}
		}.bind(this);
	},

	destroy : function(){
		for(var g in this.layers){
			this.layers[g].destroy();
		}
		if(this.gridImage){
			this.gridImage.destroy();
		}
		if(this.game){
			this.game.input.mouse.mouseMoveCallback = function(){};
			this.game.input.mouse.mouseDownCallback = function(){};
			this.game.destroy();
		}
	},


	loadTilesetImage : function(t){
		this.spritesheet = this.game.load.spritesheet(t.name,t.image,t.tilewidth,t.tileheight);

		this.spritesheet.onLoadComplete.add(function(){
			this.EventEmitter.trigger('tilesetImageLoadedInGrid', [this]);
		}, this);


		this.spritesheet.start();
	},

	setToolType : function(t){
		/*
		 * t will be
		 * 'single' -single tile
		 * 'eraser'= erases tiles only.
		 * 'fill' = fills the whole layer with one tile
		 * 'sprite' = adds a sprite popup or it is a sprite image .. that's probaby the one
		 * 'selector' = will select information like if a sprite is in the grid or
		 * "trigger" = will add a trigger popup
		 */

		this.toolType = t;
		this.marker.destroy();
		if(this.toolType !== 'single'){
			this.marker = this.game.add.sprite(0,0, t);
		} else {
			this.marker = this.game.add.sprite(0,0, '');
		}
		this.marker.width = this.tilewidth;
		this.marker.height = this.tileheight;

		//this.events.toolChanged.dispatch(this.toolType);
	},

	setMarkerFromTile : function(t){

		if(this.toolType !== 'fill'){
			this.setToolType('single');
		}

		//only fill will keep the marker
		this.marker.destroy();
		this.marker = this.game.add.sprite(0,0, t.name, t.selectedTile.frame*1);
		this.marker.tilesetId = t.selectedTile.id;

	},

	/*
	 * Checks to see if point is in the grid
	 */
	inGrid : function(point){
		if(point.x > this.loc[0] && point.y > this.loc[1] && point.x < this.loc[0]+(this.tilesx*this.tilewidth) && point.y < this.loc[1]+(this.tilesy*this.tileheight)){
			return true;
		} else {
			return false;
		}
	},

	//Places the trigger
	placeTrigger : function(){
		console.log(this.activeTile);
		var loc = '';//get active tile location
		this.events.triggerPlaced.dispatch(loc);

		//TODO: this may need to be moved at some point in time
		//this.triggers.create();
	},

	placeSprite : function(){
		console.log(this.activeTile);
		var loc = '';//get active tile location
		this.events.spritePlaced.dispatch(loc);

		//TODO: this may need to be moved at some point in time
		//this.triggers.create();
	},
};

MapEditor.Map.prototype.constructor = MapEditor.Map;
