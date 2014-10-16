Phaser.Plugin.LevelEditor.Menu = function (game, options) {
	options = options || {};
	this.color = options.color || {
		line : 0x2F2F2F,
		fill : 0x9C9C9C
	};
	this.dText = options.dText || {
		font : '18px Arial',
		fill :'#2F2F2F'
	};
	this.buttons =  {};
	this.events = {
		menuOpen :  new Phaser.Signal(),
		menuClosed : new Phaser.Signal()
	};
	
	this.height = options.height || 40;
	this.items  = {};
}

Phaser.Plugin.LevelEditor.Menu.prototype = {
	/*
	 * Makes the basic menu bar
	 */	 
	makeMenuBar : function(){
		this.bar = game.add.graphics(0, 0);
	
		this.bar.lineStyle(1, this.color.line, 1); 
		this.bar.beginFill(this.color.fill, 1);	

		//title bar bg
		this.bar.drawRect(0,0, window.innerWidth, this.height);
	},
	/*
	 * Makes a menu dropdown
	 */
	makeMenuDropdown : function(title,position,width,height,options){
		//options do nothign at this point
		this.items[title] = {
			title : title,
			type : 'dropdown',
			button : game.add.button(position.x,position.y,'',this.toggleDropdown,this),
			text : game.add.text(position.x,position.y, title,this.dText),
			subButtons : {}
		}
		this.items[title].button.dropdownObj = this.items[title];
	},
	/*
	 * Makes a button that can be on the bar or in a dropdown
	 */
	makeMenuButton : function(title,parent,position, width, height, action,image,context){
		//if parent = null then it is the bar
		//image is a key
		image = image || '';
		this.items[title] = {
			title : title,
			type : 'button',
			button : game.add.button(position.x,position.y,image,action, context),
			text : game.add.text(position.x,position.y, title,this.dText)
		}
	},
	
	toggleDropdown : function(d){
		if(this.openItem){
			this.openItem = null;
			console.log(d.dropdownObj);
			this.events.menuOpen.dispatch(this);
		} else {
			this.openItem = d;
			this.events.menuClosed.dispatch(this);
		}
	}
}

Phaser.Plugin.LevelEditor.Menu.prototype.constructor = Phaser.Plugin.LevelEditor.Menu;

Phaser.GameObjectCreator.prototype.leMenu= function (options) {

    return new Phaser.Plugin.LevelEditor.leMenu(this.game,options);

};

Phaser.GameObjectFactory.prototype.leMenu = function (options) {

    var m = new Phaser.Plugin.LevelEditor.Menu(this.game,options);
    m.makeMenuBar();
    return m;
};
