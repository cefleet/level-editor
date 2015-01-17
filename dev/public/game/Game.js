var Game = function(options){
	this.Intercom = options.Intercom || new Intercom();
	this.EventEmitter = this.Intercom.EventEmitter;

	this.listenOutFor = [
	//FROM UI
	{
		event:'playGame',
		action : 'launchGame'
	},
	{
		event :'endGame',
		action : 'destroyGame'
	}
	//FROM Editor
	];

	this.Intercom.setupListeners(this);
};


Game.prototype = {

	launchGame : function(){
		this.EventEmitter.once('mapSaved',function(map){
			//add container
			this.testGame = new Game.GameTester({container:'gameContainer',map:map});
		}.bind(this));
	},

	destroyGame : function(){
		this.testGame.game.destroy();
		delete this.testGame;
		//This is just putting it out there
		this.EventEmitter.trigger('gameDestroyed');
	}
};

Game.prototype.constructor = Game;
