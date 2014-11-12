LevelEditor.TriggerManager  = function(){
	
	this.events  = {
		triggerCreated : new Phaser.Signal()
	};
	
	this.triggers = {};
	
	return this;	
}

LevelEditor.TriggerManager.prototype = {
	
	createTrigger : function(options){
		console.log(this);
		var t = new LevelEditor.Trigger(options);
		this.triggers[t.id] = t;
		this.events.triggerCreated.dispatch(t);
	}
}
LevelEditor.TriggerManager.prototype.constructor = LevelEditor.TriggerManager;
