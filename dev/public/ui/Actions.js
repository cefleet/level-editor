UI.Actions = function(parent){

	this.parent = parent  || {};
	this.Views = UI.Views;

	this.listenOutFor = [
	{
		event : 'layerCreated',
		action : 'addLayerToList'
	},
	{
		event : 'newLayer',
		action : 'newLayer'
	},
	{
		event : 'toolCreated',
		action : 'addToolToList'
	},
	//don't know if this is good or really bad
	{
		event : 'playGame',
		action: 'saveMap'
	}
	];

	this.parent.Intercom.setupListeners(this);

	return this;
};
