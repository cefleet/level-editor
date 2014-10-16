Phaser.Plugin.LevelEditor.Popup = function (game, options) {
	options = options || {};
	this.name = options.name || 'popup';
	this.x = options.x || 100;
	this.y = options.y || 100;
	this.width = options.width || window.innerWidth-200;
	this.height = options.height || window.innerHeight-200;
	this.popupBody = document.createElement('div');
	this.popupBody.style.width = this.width+'px';
	this.popupBody.style.height= this.height+'px';
	this.popupBody.style.background = '#efefef';
	this.popupBody.style.position = 'absolute';
	this.popupBody.style.top  = this.y+'px';
	this.popupBody.style.left  = this.x+'px';

	document.body.appendChild(this.popupBody);
}

Phaser.Plugin.LevelEditor.Popup.prototype = {
	
}

Phaser.Plugin.LevelEditor.Menu.prototype.constructor = Phaser.Plugin.LevelEditor.Menu;
