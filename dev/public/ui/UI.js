UI = function(options){
	options = options || {};
	this.Intercom = options.Intercom;
	this.EventEmitter = this.Intercom.EventEmitter;
	this.Views = UI.Views;
	this.Actions = new UI.Actions(this);
	this.LaunchPad = new UI.LaunchPad(this);

  this.start();
  return this;
};

UI.prototype = {

  start : function(){
		//launches always happen from actions or lauchers
		this.Actions.loadContainers();
  },

	/*
		This is essentially the view launcher. What it does is it looks to see if there
		is a function with the name view in the Launchpad. If there is then it executes that and does the callback
		the default callback simply appends the output of the view with options recived from the launchpad. After that it checks to see if
		there is a '_' function of the view. If so then it exicutes that. The _ function of the view name
		mainly is to setup listners.
		the launchpad returns options (or not) for the view and then can change where the view launches into.
		You can also launch a view using a different launcher
	*/
	launch : function(view,into,launcher,data,callback){
		into = into || document.body;
		launcher = launcher || view;
	//	working = working || false; //doesn't do anything yet

		//If there is no view with that name this this function shall not pass
		if(typeof this.Views[view] !== 'function'){
			throw "There is no view named "+view;
		}

		var launch = function(options,into,data){
			if(typeof into === 'string'){
				into = '#'+into.replace('#',''); //this seems reduntant but it removes a has if there is one and adds it back
			}
			$(into).append(this.Views[view](options));
			if(typeof this.LaunchPad['_'+launcher] ==='function'){
				this.LaunchPad['_'+launcher](data);
			}
		}.bind(this);

		callback = callback || function(options, newInto,data){
			into = newInto || into;
			launch(options,into,data);
		}.bind(this);

		if(typeof this.LaunchPad[launcher] === 'function'){
			this.LaunchPad[launcher](callback,into,data);
		} else {
			launch(null,into,data);
		}
	},

	//This is a helper to collect form content
	//forms can be an array of element id or the name of the parent container
	collect : function(forms,next,useIds, emit){
		var data = {};
		var use = 'name';
		if(useIds === true){
			use = 'id';
		}

		if(typeof forms === 'string'){
			$('#'+forms+' :input').each(function(){
				data[$(this).attr(use)] = $(this).val();
			});
		} else if(Array.isArray(forms)){
			//TODO I may want to check to see if it is a DOM element
			forms.forEach(function(e){
				data[$('#'+e).attr(use)] = $('#'+e).val();
			});
		}
		if(emit === true) {
			this.EventEmitter.trigger(next,[data]);
		} else {
			this.Actions[next](data);
		}
	},

	processData : function(){
		console.log(this.data);
	}
};

UI.prototype.constructor = UI;
