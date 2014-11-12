var Game = function(){}
Game.prototype.constructor = Game;


Game.funcs = {
	
	launchGame : function(options){
		this.testGame = new Game.GameTester(options);
	},
	
	destroyGame : function(){
		this.testGame.game.destroy();
		delete this.testGame;
	}
};

Phaser.Utils.extend( Game.prototype ,  Game.funcs );
