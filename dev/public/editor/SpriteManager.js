LevelEditor.SpriteManager = function(){
	
	this.events  = {
		spriteCreated : new Phaser.Signal()
	};
	
	this.triggers = {};
	
	return this;	
}

LevelEditor.SpriteManager.prototype = {
	
	create : function(options){
		console.log(this);
		var t = new LevelEditor.Sprite(options);
		this.sprites[t.id] = t;
		this.events.spriteCreated.dispatch(t);
	}
}
LevelEditor.SpriteManager.prototype.constructor = LevelEditor.SpriteManager;
