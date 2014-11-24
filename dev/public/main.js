var GameMaker = {};

document.addEventListener( "DOMContentLoaded", function(){
	//GameMaker.EventEmitter = new EventEmitter();
	//this loads EventEmitter
	GameMaker.Intercom = new Intercom();

	//creates the level editor
	GameMaker.ME = new MapEditor({
		main : 'gameBG',
		grid : 'grid',
		tileset : 'tileset',
		Intercom : GameMaker.Intercom
	});

	//creates the Game
	GameMaker.Game = new Game({
		Intercom : GameMaker.Intercom
	});

	//creates the UI
	GameMaker.UI = new UI({
		Intercom : GameMaker.Intercom
	});

	//loads data
	$.get('/loading',function(data,status){
		GameMaker.UI.data = data;
		GameMaker.UI.processData();
	});

}, false );

//JUst randomness
var $uid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	};
})();
