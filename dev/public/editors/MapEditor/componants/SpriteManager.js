MapEditor.SpriteManager = function(parent){
	this.parent = parent;
	this.EventEmitter = this.parent.EventEmitter;

	this.sprites = {};

	return this;
};

MapEditor.SpriteManager.prototype = {

	create : function(options){
	//	console.log(this);
		var t = new MapEditor.Sprite(options);
		this.sprites[t.id] = t;
		//this.events.spriteCreated.dispatch(t);
		this.EventEmitter.trigger('spriteCreated', t);
	}
};
MapEditor.SpriteManager.prototype.constructor = MapEditor.SpriteManager;
