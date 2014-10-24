document.addEventListener( "DOMContentLoaded", function(){
	MasterEmitter = new EventEmitter();	
	$aC(document.body, [
		UI.Views.modal(),
		UI.Views.navbar()
	]);
	UI.setupEvents();  
	var data = JSON.parse(localStorage.getItem('LevelEditor'));
	if(!data) {
		var id = $uid();
		data = {
			Tilesets : {},
			Maps : {}      
		};
    
		data.Tilesets[id] = {
			image : 'sampletileset.png',
			id : id,
			imageheight : '256',
			imagewidth : '256',
			name : 'sample',
			tilewidth : 32,
			tileheight : 32
		}
	};
  
	UI.data = data;
}, false );
