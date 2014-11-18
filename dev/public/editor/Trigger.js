LevelEditor.Trigger = function(options){
	options = options || {};
	this.id = options.id || $uid();
	this.name = options.name || 'trigger';
	this.type = options.type || 'sprite'; //sprite,off 
	this.location = options.location || {x:0,y:0};//location
	this.tileId = options.tileId || 0;
	this.sprite = options.sprite || '';//if sprite is null then it is an invisible sprit
	this.width = options.width || '32';
	this.height = options.height || '32';
	this.layer = options.layer || '0';
	this.triggeredBy = options.triggeredBy || 'collide'; //collide, action, trigger (ones that are called by trigger don't have a location)
	this.actionType = options.actionType || 'addSprite'; //addSprite,removeSprite,moveSprite,animateSprite,showLayer,hideLayer, customCode
	this.impactItem = options.impactItem || 'triggeredSprite';//this needs to be a sprite or a layer determined by "this.actionType" not used for customCode //this is the item impacted by trigger
	this.onComplete = options.onComplete || '';//'',{action : callTrigger, trigger : trigername || id} , {action : callCode, code : function to run}
	
	return this;			
}
