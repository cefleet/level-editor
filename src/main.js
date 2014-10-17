document.addEventListener( "DOMContentLoaded", function(){
	MasterEmitter = new EventEmitter();	
	$aC(document.body, [UI.Views.navbar()]);
	UI.setupEvents();  
}, false );
