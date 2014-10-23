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
				
		//jquery stuff
		$('#mainModal').modal('show');
		
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
		
		var collectData = function(){
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
			
			if(game.le.map.id){
				game.le.destroy();
			}
			game.le.create($g('mapNameFormItem').value,grid,tileset);
			$('#mainModal').modal('hide');
		}
		
		createButton.addEventListener('click', collectData,this);		
	},
	
	/* 
	   Saves the current map
	*/
	saveMap : function(){
	  var map = game.le.saveMap();
	  console.log(map);
	}
}
