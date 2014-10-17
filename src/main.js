document.addEventListener( "DOMContentLoaded", function(){
	MasterEmitter = new EventEmitter();	
	$aC(document.body, [
		UI.Views.modal(),
		UI.Views.navbar()
	]);
	UI.setupEvents();  
	var data = JSON.parse(localStorage.getItem('LevelEditor'));
	UI.data = data;
}, false );
