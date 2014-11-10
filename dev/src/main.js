document.addEventListener( "DOMContentLoaded", function(){
	MasterEmitter = new EventEmitter();	
	$aC(document.body, [
		UI.Views.gameModal(),
		UI.Views.alertModal(),
		UI.Views.modal(),
		UI.Views.navbar()
	]);
	$aC($g('mainRow'), [
		UI.Views.mainPanel(),
		UI.Views.toolPanel()
	]);
	
	//adds the tools ..
	$aC($g('gameTools'),[UI.Views.tools()]);
	//toggles layers
	$('#toggleLayers').on('click', function () {
		UI.Actions.toggleLayers()		
	});
		
	$('#addLayer').on('click', function () {
		UI.Actions.newLayerPopup();
	});
	//Little bit of hacking is fine from now to then
	var gg = $g('gameGrid');
	var gt = $g('gameTileset');
	$sA(gg,{
		style:'max-height:'+(window.innerHeight-180)+'px;overflow:auto'
	});
	
	$sA(gt,{
		style:'max-height:'+(window.innerHeight-130)+'px;overflow:auto'
	});
	UI.setupEvents();  
	
	$.get('/loading',function(data,status){
		UI.data = data;
	})
	
	 
}, false );
