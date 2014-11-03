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
		
		$rAC($g('layersList'));

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
		$rAC($g('layersList'));
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
		$('#gameGrid').toggleClass('col-xs-8').toggleClass('col-xs-12');
		$('#gameLayers').toggleClass('col-xs-4').toggle();
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
	
	createNewLayerUI : function(name,id){
		//add to the list here
		var layerItem = UI.Views.newLayer();
		layerItem.id = id;
		layerItem.setAttribute('layerName', name);
		layerItem.setAttribute('layerId', id);
		
		$aC(layerItem.firstChild.firstChild, [$cTN(' '+name)]);
		
		var layerList = $g('layersList');
		layerList.insertBefore(layerItem, layerList.firstChild);		
		
		//add listener s
		$("#"+layerItem.id).delegate(".makeLayerActive", "click", function(e) {

			var layername = this.parentNode.parentNode.getAttribute('layerName');
			var layerid= this.parentNode.parentNode.getAttribute('layerId');
			
			$('.makeLayerActive').removeClass("active");
			LE.activateLayer(layerid);
			$(this).addClass('active');
      
		});
    
		$("#"+layerItem.id).delegate(".setVisibilityLayer", "click", function(e) {
			var layerid= this.parentNode.parentNode.getAttribute('layerId');
			LE.toggleLayerVisibility(layerid);
		});

		$("#"+layerItem.id).delegate(".layerName", "click", function(e) {
			
			//probably a jquery way to do this
			var layername = this.parentNode.parentNode.getAttribute('layerName'); 
			var layerid= this.parentNode.parentNode.getAttribute('layerId');
			
			var toggables = $(this).parent();      
			toggables.next().children().val(layername);
			toggables.toggleClass('show').toggleClass('hidden');
			toggables.next().toggleClass('hidden').toggleClass('show');
						
			$(document).one('click',function() {
				var newName = toggables.next().children().val();
				
				$rAC(layerItem.firstChild.firstChild);
				$aC(layerItem.firstChild.firstChild, [$cTN(' '+newName)]);
								
				toggables.toggleClass('show').toggleClass('hidden');
				toggables.next().toggleClass('hidden').toggleClass('show');
								
				//TODO send this information to LE
				LE.changeLayerName(layerid,newName);
				toggables.parent().attr('layerName', newName);
				
			});
			$("#"+layerItem.id).click(function(e){
				e.stopPropagation();
			});
		});
    
		$("#"+layerItem.id).delegate(".deleteLayer", "click", function(e) {
			var layername = this.parentNode.parentNode.getAttribute('layerName'); 
			var layerid= this.parentNode.parentNode.getAttribute('layerId');
			$rAC($g('dangerAlertContent'));
			$('#continueDanger').off();//maybe?
			$aC($g('dangerAlertContent'),[
				$nE('h4', {}, $cTN('Warning')),
				$nE('p', {}, $cTN('You are about to Delete the layer named '+layername)),
				$nE('p', {}, $cTN('Do you want to continue? This action cannot be undone'))
			]);
			$('#alertModal').modal('show');
			//confirm 
			$('#continueDanger').on('click', function(){
				console.log(layerid);
				LE.deleteLayer(layerid);
				$('#'+layerid).remove();
				$('#alertModal').modal('hide');
			});
			//delete UI
			
			//DELETE sprite group
			

		});
    
     $("#"+layerItem.id).delegate(".layerName", "click", function(e) {

        var layername = this.parentNode.parentNode.getAttribute('layerName');
        
    });
	
	},
	
	createNewLayer :function(name){
		var id = $uid();
		LE.addLayer(name, id);
		//LE.activateLayer(id); 
		//UI.Actions.createNewLayerUI(name,id);
	},
	
	_getNewLayerFormData : function(){
		UI.Actions.createNewLayer($g('layerNameFormItem').value);  
		
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
