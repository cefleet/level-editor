UI = {
	setupEvents : function(){
		this.events = MasterEmitter;
  
        
		//This stays here
		//Navigation Controls
		var links = $gBT('a', $g('navigation'));
		for(var i = 0; i < links.length; i++){
			links[i].addEventListener('click', function(){
				UI.events.emitEvent('navLinkClicked', [this.id]);
			}.bind(links[i]));   
		}
    
		//Zom Controls
		var gridZoom = $gBT('a', $g('gridZoomOptions'));
		for(var i = 0; i < gridZoom.length; i++){
			gridZoom[i].addEventListener('click', function(){
				UI.Actions.zoomGridTo(this.getAttribute('zoom'));
			}.bind(gridZoom[i]));   
		}
    
		//This recives information from the nav bar
		this.events.addListener('navLinkClicked', this.navClicked.bind(this));
		//if the id of an event that has been emmited is the name of a function
		//(minus Link) run that function
		
		var playGameBtn = $g('playGameButton');
		playGameBtn.addEventListener('click', function(){
			UI.Actions.playGame();
		});
		
		$('#gameModal').on('hidden.bs.modal', function (e) {
			UI.Actions.destroyGame();
		})
		
		$('#layersList').sortable({
			update: function( event, ui ) {
				//This may be wrong but it iwl
				var layers = $g('layersList').children;
				var order = [];
				for(var i = 0; i < layers.length; i++){
					order.push(layers[i].id);
				}
				LE.orderLayers(order);				
			}
		});
		
	},

	navClicked : function(clicked){
		if(this.navLinkToFunc[clicked]){	
			this.Actions[this.navLinkToFunc[clicked]]();
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
