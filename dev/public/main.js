var GameMaker ={};

document.addEventListener( "DOMContentLoaded", function(){
	GameMaker.EventEmitter = new EventEmitter();

	//creates the level editor
	GameMaker.LE = new LevelEditor({
		main : 'gameBG',
		grid : 'gameGrid',
		tileset : 'gameTileset',
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
