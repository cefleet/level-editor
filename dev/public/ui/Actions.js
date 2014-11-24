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
	}
	];

	this.parent.Intercom.setupListeners(this);

	return this;
};
