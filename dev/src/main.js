document.addEventListener( "DOMContentLoaded", function(){
	MasterEmitter = new EventEmitter();	
	$aC(document.body, [
		UI.Views.gameModal(),
		UI.Views.modal(),
		UI.Views.navbar()
	]);
	$aC($g('mainRow'), [
		UI.Views.mainPanel(),
		UI.Views.toolPanel()
	]);
	
	//Little bit of hacking is fine from now to then
	var gg = $g('gameGrid');
	var gt = $g('gameTileset');
	
	$sA(gg,{
		style:'max-height:'+(window.innerHeight-130)+'px;overflow:auto'
	});
	$sA(gt,{
		style:'max-height:'+(window.innerHeight-130)+'px;overflow:auto'
	});
	UI.setupEvents();  
	
	$.get('/loading',function(data,status){
		console.log(data);
		UI.data = data;
	})
	/*
	var data = JSON.parse(localStorage.getItem('LevelEditor'));
	if(!data) {
		var id = $uid();
		data = {
			Tilesets : {},
			Maps : {}      
		};
    
		data.Tilesets[id] = {
			image : 'img/sampletileset.png',
			id : id,
			imageheight : '256',
			imagewidth : '256',
			name : 'sample',
			tilewidth : 32,
			tileheight : 32
		}
	};
  
	UI.data = data;
	* */
	
	//UI data must come from node.. just bring it all at this point 
	 
}, false );
