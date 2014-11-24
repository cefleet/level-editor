var GameMaker ={};

document.addEventListener( "DOMContentLoaded", function(){
	GameMaker.EventEmitter = new EventEmitter();

	//creates the level editor
	GameMaker.ME = new MapEditor({
		main : 'gameBG',
		grid : 'grid',
		tileset : 'tileset',
		EventEmitter : GameMaker.EventEmitter
	});

	//creates the Game
	GameMaker.Game = new Game({
		EventEmitter : GameMaker.EventEmitter
	});

	//creates the UI
	GameMaker.UI = new UI({
		EventEmitter : GameMaker.EventEmitter
	});

	//loads data
	$.get('/loading',function(data,status){
		GameMaker.UI.data = data;
		GameMaker.UI.processData();
	});

}, false );
