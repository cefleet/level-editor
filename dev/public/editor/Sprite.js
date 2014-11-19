LevelEditor.Trigger = function(options){
	options = options || {};
	this.id = options.id || $uid();
	this.name = options.name || 'sprite';
	this.spritesheet = options.spritesheet || 'img/player.png'; 
	this.frameSize = options.frameSize || {width : '', height:''}; //default is the whole image. Othewise it is a object with width/ height attributes
	this.location = options.location || {x:0,y:0};//location
	this.layer = options.layer || '0';
	
	//these all are added when you edit a sprite
	this.animations = false; //This is an object {name : [frames], name: [frames]}
	this.patrol = false; //or an array of locations 
	this.onPlayerCollision = false; //The options here are false,destroy,trigger,or code //You can set it false and apply trigger from the trigger or apply it here
	this.onSpriteCollision = false;//What happens when colliding with another sprite false,destroy,trigger,or code
	
	//this is not nessessary for the editor.
	this.patrolling = false; 
	this.patrolPos = 0; // the index of the sprites patrol
	
	return this;			
}
