var GameMaker ={};
document.addEventListener( "DOMContentLoaded", function(){
	GameMaker.EventEmitter = new EventEmitter();	

	GameMaker.LE = new LevelEditor({
		main : 'gameBG',
		grid : 'gameGrid',
		tileset : 'gameTileset',
		EventEmitter : GameMaker.EventEmitter
	});

	GameMaker.Game = new Game({
		EventEmitter : GameMaker.EventEmitter
	});
	
	GameMaker.UI = new UI({
		EventEmitter : GameMaker.EventEmitter
	});
	
	$aC(document.body, [
		GameMaker.UI.Views.gameModal(),
		GameMaker.UI.Views.alertModal(),
		GameMaker.UI.Views.modal(),
		GameMaker.UI.Views.navbar()
	]);
	$aC($g('mainRow'), [
		GameMaker.UI.Views.mainPanel(),
		GameMaker.UI.Views.toolPanel()
	]);
	
	//adds the tools ..
	$aC($g('gameTools'),[GameMaker.UI.Views.tools()]);
	//toggles layers
	$('#toggleLayers').on('click', function () {
		GameMaker.UI.Actions.toggleLayers()		
	});
		
	$('#addLayer').on('click', function () {
		GameMaker.UI.Actions.newLayerPopup();
	});

	$sA($g('gameGrid'),{
		style:'max-height:'+(window.innerHeight-180)+'px;overflow:auto'
	});
	
	$sA($g('gameTileset'),{
		style:'max-height:'+(window.innerHeight-130)+'px;overflow:auto'
	});
	GameMaker.UI.setupEvents();  
	
	$.get('/loading',function(data,status){
		GameMaker.UI.data = data;
	})
	
	 
}, false );
