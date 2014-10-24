UI.Actions = {

/*
  Makes a popup to create a new map  
*/

	createNewMapPopup : function(){
		//sets the title
		$rAC($g('modalTitle'));
		$aC($g('modalTitle'), [$cTN('New Map')]);
		//adds the form
		$rAC($g('modalBody'));
		$aC($g('modalBody'),[UI.Views.newMapForm()]);
		
		//
		$rAC($g('modalFooter'));
				
		//Get possible tilesets
		var tilesets = UI.data.Tilesets;
		var options = [];
		for(var t in tilesets){
			options.push($nE('option', {"value":t}, $cTN(tilesets[t].name)));
		}
		
		//set tilesets in modal
		$aC($g('tilesetFormItem'),options);
		
		//add create button
		$aC($g('modalFooter'),[$nE('button', {"id":"createMapButton","class":"btn btn-primary"}, $cTN('Create Map'))]);
		
		var createButton = $g('createMapButton');
		createButton.addEventListener('click', this._getNewMapFormData.bind(this),this);			
				
		//jquery stuff
		$('#mainModal').modal('show');
			
	},
	
	_getNewMapFormData : function(){
		
			var t = UI.data.Tilesets[$g('tilesetFormItem').value]; //the tilesets
			tileset = {
				image : t.image,
				imageheight : t.imageheight,
				imagewidth : t.imagewidth,
				name : t.name,
				tilewidth : t.tilewidth,
				tileheight : t.tileheight
			};
			grid = {
				tilesx : $g('widthFormItem').value,
				tilesy : $g('heightFormItem').value,
				tilewidth : t.tilewidth,
				tileheight : t.tileheight
			};
			$('#mainModal').modal('hide');
			this._createNewMap($g('mapNameFormItem').value,grid,tileset);
		},
	
	//This all can be run from the map using event Emmiters ... not sure which way is best now
	 _createNewMap : function(name,grid,tileset){
		 
		if(game.le.map.id){
			game.le.destroy();
		}		
		game.le.create(name,grid,tileset);
	},
	/* 
	   Saves the current map
	*/
	saveMap : function(){
	  var map = game.le.saveMap();
	  UI.data.Maps[map.id] = map;
	  localStorage.setItem('LevelEditor', JSON.stringify(UI.data));
	  //popup saved
	},
	
	loadMapSelection : function(){
		var maps = UI.data.Maps;
		$rAC($g('modalTitle'));
		$aC($g('modalTitle'), [$cTN('Select Map')]);
		//adds the form
		$rAC($g('modalBody'));
		$aC($g('modalBody'),[UI.Views.loadMapSelection()]);
		
		var options = [];
		for(var m in maps){
			options.push($nE('option', {"value":m}, $cTN(maps[m].name)));
		}
		
		$aC($g('mapsFormItem'),options);
		//
		$rAC($g('modalFooter'));
		$aC($g('modalFooter'),[$nE('button', {"id":"loadMapButton","class":"btn btn-primary"}, $cTN('Load Map'))]);
		
		var loadButton = $g('loadMapButton');
		loadButton.addEventListener('click', this._getLoadMapFormData.bind(this),this);
		$('#mainModal').modal('show');
	},
	_getLoadMapFormData : function(){
		var map = UI.data.Maps[$g('mapsFormItem').value];
		this._loadMap(map);
		$('#mainModal').modal('hide');
	},
	
	_loadMap : function(map){
		game.le.load(map);
	}
	
}
