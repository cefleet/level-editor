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
		  var tilesetId = $g('tilesetFormItem').value;
		  
			var t = UI.data.Tilesets[tilesetId]; //the tilesets
			tileset = {
				image : t.image,
				imageheight : Number(t.imageheight),
				imagewidth : Number(t.imagewidth),
				name : t.name,
				tilewidth : Number(t.tilewidth),
				tileheight : Number(t.tileheight)
			};
			
			grid = {
				tilesx : Number($g('widthFormItem').value),
				tilesy : Number($g('heightFormItem').value),
				tilewidth : Number(t.tilewidth),
				tileheight : Number(t.tileheight)
			};

			this._createNewMap($g('mapNameFormItem').value,grid,tileset);
			var mapTitle = $g('navbarMapName');
			$rAC(mapTitle);
			$aC(mapTitle, [$cTN($g('mapNameFormItem').value)]);
			
			$('#mainModal').modal('hide');
			UI.activeTilesetId = tilesetId;
		},
	
	//This all can be run from the map using event Emmiters ... not sure which way is best now
	 _createNewMap : function(name,grid,tileset){
		 
		if(LE.map.id){
			LE.destroy();
		}		
		LE.create(name,grid,tileset);
		
		UI.activeMap = LE.map;
		UI.activeMap.tilset = UI.activeTilesetId;
		$g('playGameButton').disabled = false;
		$g('toggleLayers').disabled = false;
		$g('addLayer').disabled = false;
    LE.grid.events.gameCreated.add(function(){
      UI.Actions.createNewLayer('base');
    });
	},
	/* 
	   Saves the current map
	*/
	saveMap : function(){
	  var map = LE.saveMap();
	  map.tilesetId = UI.activeTilesetId;
	  
	  
	  
	  UI.data.Maps[map.id] = map;//saves it to memory
	  
	  map.tilemap = JSON.stringify(map.tilemap);
	  
	  //now save it to database
	  $.post('save_map', map);


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

		LE.load(map);
		var mapTitle = $g('navbarMapName');
		$rAC(mapTitle);
		$aC(mapTitle, [$cTN(map.name)]);
		
		UI.activeMap = map;
		$g('playGameButton').disabled = false;
	},
	
	settingsPopup :function(){
	  //sets the title
		$rAC($g('modalTitle'));
		$aC($g('modalTitle'), [$cTN('Change Map Settings')]);
		//adds the form
		$rAC($g('modalBody'));
		$aC($g('modalBody'),[UI.Views.settingsForm()]);
		
		//
		$rAC($g('modalFooter'));
				
		//Get possible tilesets
		var tilesets = UI.data.Tilesets;
		var options = [];
		for(var t in tilesets){
      if(UI.activeMap.tilesetId != t){
			  options.push($nE('option', {"value":t}, $cTN(tilesets[t].name)));
			} else {
			  options.push($nE('option', {"value":t, "selected":"selected"}, $cTN(tilesets[t].name)));
		  }
		}
		
		//TODO Selet only those with the same tiles size or errors will happen
		//set tilesets in modal
		$g('mapNameFormItem').value = UI.activeMap.name;
		$aC($g('tilesetFormItem'),options);
		
		//add create button
		$aC($g('modalFooter'),[$nE('button', {"id":"updateMapButton","class":"btn btn-primary"}, $cTN('Update Map'))]);
		
		var updateButton = $g('updateMapButton');
		updateButton.addEventListener('click', this._getUpdateMapFormData.bind(this),this);			
				
		//jquery stuff
		$('#mainModal').modal('show');
	},
	
	_getUpdateMapFormData : function(){
	  
	  //get the map name and tileset
	  var name = $g('mapNameFormItem').value;
	  var tileset = $g('tilesetFormItem').value;
   	
   	var mapTitle = $g('navbarMapName');
	  $aC(mapTitle, [$cTN(name)]);	
	  
	  LE.map.name = name;
	  UI.activeMap.name = name;
	  $('#mainModal').modal('hide');
	},
	
	/*
	 * Sets the zoom level of the grid
	 */
	zoomGridTo : function(zoomLvl){
		//should just talk to LE I think
		LE.grid.scaleTo(zoomLvl);
	},
	
	/*
	 * Launches the modal to put the game into
	 */
	 
	playGame : function(){
	//TODO do something with height and width
		var container = $g('gameModalBody');
		var baseWidth = container.offsetWidth;
		var baseHeight = window.innerHeight-130;
		
		var options = {
			container : 'gameModalBody',
			
		}
		LE.launchGame(options);
		$('#gameModal').modal('show');
	},
	
	destroyGame : function(){
		LE.destroyGame();
		LE.load(UI.activeMap);
	},
	
	//TODO this does not work It is never active
	toggleLayers : function(){
		if($(this).hasClass('active')){
		  console.log('Remove col-xs-8');
			$('#gameGrid').removeClass('col-xs-8');
			$('#gameGrid').addClass('col-xs-12');
			$('#gameLayers').removeClass('col-xs-4').toggle();
		} else {
			 console.log('Remove col-xs-12');
			$('#gameGrid').removeClass('col-xs-12');
			$('#gameGrid').addClass('col-xs-8');
			$('#gameLayers').addClass('col-xs-4').toggle();
		}
	},
	
	newLayerPopup : function(){
		//sets the title
		$rAC($g('modalTitle'));
		$aC($g('modalTitle'), [$cTN('New Layer')]);
		//adds the form
		$rAC($g('modalBody'));
		$aC($g('modalBody'),[UI.Views.newLayerForm()]);
		
		$rAC($g('modalFooter'));				
		
		//add create button
		$aC($g('modalFooter'),[$nE('button', {"id":"addLayerButton","class":"btn btn-primary"}, $cTN('Add Layer'))]);
		
		var createButton = $g('addLayerButton');
		createButton.addEventListener('click', this._getNewLayerFormData.bind(this),this);			
				
		//jquery stuff
		$('#mainModal').modal('show');
	},
	
	createNewLayer : function(name){
	  LE.addLayer(name);

		//add to the list here
		var layerItem = UI.Views.newLayer();
		layerItem.id = $uid();
		layerItem.setAttribute('layerName', name);

		$aC(layerItem.firstChild.firstChild, [$cTN(' '+name)]);
		
		var layerList = $g('layersList');
		layerList.insertBefore(layerItem, layerList.firstChild);
		
		console.log(layerItem);
		
		//add listener s
		$("#"+layerItem.id).delegate(".makeLayerActive", "click", function(e) {

        var layername = this.parentNode.parentNode.getAttribute('layerName');
        
        $('.makeLayerActive').removeClass("active");
        
        LE.activateLayer(layername);
        
        $(this).addClass('active');
      
    });
    
     $("#"+layerItem.id).delegate(".setVisibilityLayer", "click", function(e) {

        var layername = this.parentNode.parentNode.getAttribute('layerName');
        LE.toggleLayerVisibility(layername);

    });
    
    $("#"+layerItem.id).delegate(".editLayer", "click", function(e) {

        var layername = this.parentNode.parentNode.getAttribute('layerName');
        
    });
    
    $("#"+layerItem.id).delegate(".deleteLayer", "click", function(e) {

        var layername = this.parentNode.parentNode.getAttribute('layerName');

    });
    
     $("#"+layerItem.id).delegate(".layerName", "click", function(e) {

        var layername = this.parentNode.parentNode.getAttribute('layerName');
        
        //TODO make this turn it into a 

    });
	
	},
	
	_getNewLayerFormData : function(){
		var name = $g('layerNameFormItem').value;
		UI.Actions.createNewLayer(name);		
		$('#mainModal').modal('hide');
	},
	
	//TODO this is really messy and needs refractering but it works as expected. 
	//I need to have width,height and tilewidth and tileheight in this as well to start. At that point I can upload new tilesets
	createNewTilesetPopup : function(){
		//sets the title
		$rAC($g('modalTitle'));
		$aC($g('modalTitle'), [$cTN('New Tileset')]);
		//adds the form
		$rAC($g('modalBody'));
		$aC($g('modalBody'),[UI.Views.newTilesetForm()]);
		
		//
		$rAC($g('modalFooter'));
						
		//add create button
		$aC($g('modalFooter'),[$nE('button', {"id":"createTilesetButton","class":"btn btn-primary"}, $cTN('Create Tileset'))]);
		
		var createButton = $g('createTilesetButton');
		createButton.addEventListener('click', getData,this);			
				
		//jquery stuff
		$('#mainModal').modal('show');
		
		var files;
 
		// Add events
		$('input[type=file]').on('change', prepareUpload);
 
		// Grab the files and set them to our variable
		function prepareUpload(event){
			files = event.target.files;
		}
		
		function getData(){
			var data = new FormData();
			$.each(files, function(key, value)	{
				data.append(key, value);
			});
			
			var fields = {
				name : $g('tilesetNameFormItem').value,
				tileheight : $g('tileheightFormItem').value,
				tilewidth :  $g('tilewidthFormItem').value,
				imagewidth : $g('imagewidthFormItem').value,
				imageheight : $g('imageheightFormItem').value,
				collision : $g('collisionTilesFormItem').value,
				shared : false
			}
			
			for(key in fields){			
				data.append(key,fields[key]);
			}

			$.ajax({
				url :'/upload/',
				type :'POST',
				data : data,
				 cache: false,
				dataType: 'json',
				processData: false, // Don't process the files
				contentType: false,
				complete : function(){
					$('#mainModal').modal('hide');
				}
			});
		}		
	},
}
