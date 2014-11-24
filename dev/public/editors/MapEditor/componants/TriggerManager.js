MapEditor.TriggerManager  = function(parent){
	this.parent = parent;
	this.EventEmitter = this.parent.EventEmitter;
	this.triggers = {};
	return this;

};

MapEditor.TriggerManager.prototype = {

	create : function(options){

		var t = new MapEditor.Trigger(options);
		this.triggers[t.id] = t;

	}
};
MapEditor.TriggerManager.prototype.constructor = MapEditor.TriggerManager;
