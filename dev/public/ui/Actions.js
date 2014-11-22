UI.Actions = function(parent){

	this.parent = parent  || {};
	this.Views = UI.Views;
	return this;
};

UI.Actions.prototype = {
	newMap : function(){
		this.parent.launch('modal', null, 'newMap');
	},

	loadMap : function(){
		console.log('Launch Load Map Modal');
	},

	saveMap : function(){
		console.log('Save The Map');
	},

	newTileset : function(){
		console.log('Create New Tileset');
	},

	createMap : function(data){
		console.log(data);
		//Tell UI to launch the panels for the grid and the tools
		
		//This sends out the event so the editor can begin its work
		this.parent.EventEmitter.trigger('createMap',[data]);
	}

};
