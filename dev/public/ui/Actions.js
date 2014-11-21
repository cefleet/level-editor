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

	//TODO instead of this make a function similer to the launcher
	getNewMapFormData : function(){
		console.log(this);
		//after gotten all of the information
		var formData = {};//should be f
		this.createNewMap(formData);
	},

	createNewMap : function(){
		console.log('Begin the cycle to do something as awesome as loading a map');
		//This is where i need to make a decision on how to communicate with the
		//editor.
	}

};
