UI = function(options){
	options = options || {};
	this.EventEmitter = options.EventEmitter || new EventEmitter();
	this.Actions = new UI.Actions(this);
	this.Views = new UI.Views(this);
	return this;
};

UI.prototype = {
	setupEvents : function(){
		//this.events = MasterEmitter;
  
        
		//This stays here
		//Navigation Controls
		/*
		 * TODO THIS IS BAD AS WELL
		 */
		var links = $gBT('a', $g('navigation'));
		for(var i = 0; i < links.length; i++){
			links[i].addEventListener('click', function(){
				/****BAD BAD BAD **/
				GameMaker.UI.EventEmitter.trigger('navLinkClicked', [this.id]);
			}.bind(links[i]));   
		}
    
		//Zom Controls
		
		/***********************
		 * TODO THIS IS BAD
		 * //
		 */ 
		var gridZoom = $gBT('a', $g('gridZoomOptions'));
		for(var i = 0; i < gridZoom.length; i++){
			gridZoom[i].addEventListener('click', function(){
				GameMaker.UI.zoomGridTo(this.getAttribute('zoom'));
			}.bind(gridZoom[i]));   
		}
    
		//This recives information from the nav bar
		this.EventEmitter.addListener('navLinkClicked', this.navClicked.bind(this));
		//if the id of an event that has been emmited is the name of a function
		//(minus Link) run that function
		
		var playGameBtn = $g('playGameButton');
		playGameBtn.addEventListener('click', function(){
			GameMaker.UI.Actions.playGame();
		});
		
		$('#gameModal').on('hidden.bs.modal', function (e) {
			GameMaker.UI.Actions.destroyGame();
		})
		
		$('#layersList').sortable({
			update: function( event, ui ) {
				//This may be wrong but it iwl
				var layers = $g('layersList').children;
				var order = [];
				for(var i = 0; i < layers.length; i++){
					order.push(layers[i].id);
				}
				GameMaker.LE.orderLayers(order);				
			}
		});
		
		$('.toolButton').on('click',function(){
		  GameMaker.UI.Actions.activateTool(this.id.replace('Tool',''));
		});
		
	},

	navClicked : function(clicked){
		if(this.navLinkToFunc[clicked]){	
			GameMaker.UI.Actions[this.navLinkToFunc[clicked]]();
		}
	},
	
	////Here I can have an array telling which function to run based on options
	navLinkToFunc : {
		newMapNavLink : 'createNewMapPopup',
		saveMapNavLink : 'saveMap',
		loadMapNavLink :'loadMapSelection',
		settingsNavLink : 'settingsPopup',
		newTilesetNavLink  : 'createNewTilesetPopup'
	}
}

UI.prototype.constructor = UI;
