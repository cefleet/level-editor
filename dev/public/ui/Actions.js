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
	}

};
