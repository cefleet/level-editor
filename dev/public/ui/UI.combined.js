UI = function(options){
	options = options || {};
	this.Intercom = options.Intercom;
	this.EventEmitter = this.Intercom.EventEmitter;
	this.Views = UI.Views;
	this.Actions = new UI.Actions(this);
	this.LaunchPad = new UI.LaunchPad(this);

  this.start();

	//setup some elements for jquery
	var $this = this;
	$(document.body).delegate('.ui-action', 'click', function(){
		var action = $(this).attr('ui-action');

		//TODO: seperating hte launch vs collect in the future would be good
		//if(action.indexOf('launch') === 0){

	//	} else {
			$this.Actions[action]();
	//	}

	});

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
				this.LaunchPad['_'+launcher](data,into);
			}
		}.bind(this);

		callback = callback || function(options,newInto,data){
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
	collect : function(forms,next,useIds,emit){
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
			//TODO: I may want to check to see if it is a DOM element
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

UI.Actions = function(parent){

	this.parent = parent  || {};
	this.Views = UI.Views;

	this.listenOutFor = [
	{
		event : 'layerCreated',
		action : 'addLayerToList'
	},
	{
		event : 'newLayer',
		action : 'newLayer'
	},
	{
		event : 'toolCreated',
		action : 'addToolToList'
	}
	];

	this.parent.Intercom.setupListeners(this);

	return this;
};

UI.Actions.prototype.addLayerToList = function(layer){
  this.parent.launch('li','layers','layerListItem',layer);
};

UI.Actions.prototype.addToolToList = function(tool){
  this.parent.launch('div','tools','toolListItem',tool);
};

UI.Actions.prototype.createLayer = function(data){
  var send = [
    data.name
  ];

  this.parent.EventEmitter.trigger('createLayer',send);
};

UI.Actions.prototype.createMap = function(data){
  this.parent.launch('panel', 'mainPanel', 'launchMainPanel');

  $('#mainModal').modal('hide');

  var tileset;
  for(var i = 0; i < this.parent.data.Tilesets.length; i++){
    if(this.parent.data.Tilesets[i]._id === data.tilesetId){
      tileset = this.parent.data.Tilesets[i];
    }
  }
  tileset.id = tileset._id;
  tileset.container = 'tileset';
  var send = [
  data.name,
  {
    tilesx : Number(data.tilesx),
    tilesy : Number(data.tilesy),
    tilewidth : tileset.tilewidth, //TODO: make these not needed
    tileheight : tileset.tileheight //TODO: make these not needed
  },
  tileset
  ];

  console.log(send);

    //This sends out the event so the editor can begin its work
  this.parent.EventEmitter.trigger('createMap',send);
};

UI.Actions.prototype.loadContainers = function(){
  this.parent.launch('navbar');
  this.parent.launch('mainBody');
};

UI.Actions.prototype.loadMap = function(){
  $('#mainModal').remove();
  this.parent.launch('modal', null, 'loadMap');
};

UI.Actions.prototype.loadTheMap = function(data){
    console.log(data);
    var map;
    for(var i = 0; i < this.parent.data.Maps.length; i++){
      if(this.parent.data.Maps[i].id == data.id){
        map = this.parent.data.Maps[i];
      }
    }
    console.log(map);
    for(i = 0; i < this.parent.data.Tilesets.length; i++){
      if(this.parent.data.Tilesets[i]._id == map.tilesetId){
        map.tileset = this.parent.data.Tilesets[i];
      }
    }
    console.log('I need to Emit out the map to load');
    this.parent.launch('panel', 'mainPanel', 'launchMainPanel');
    $('#mainModal').modal('hide');

    this.parent.EventEmitter.trigger('loadMap',[map]);
};

UI.Actions.prototype.newLayer = function(){
  $('#mainModal').remove();
  
  this.parent.launch('modal', null, 'newLayer');
};

UI.Actions.prototype.newMap = function(){
  $('#mainModal').remove();
  this.parent.launch('modal', null, 'newMap');
};

UI.Actions.prototype.newTileset = function(){
  console.log('Create New Tileset');
};

UI.Actions.prototype.saveMap = function(){
  var $this = this;
  this.parent.EventEmitter.once('mapReadyForSave',function(map){
    $this.parent.data.Maps[map.id] = map;//saves it to memory
    map.tilemap = JSON.stringify(map.tilemap);
    $.post('save_map',map).done(function(data){
      data.id = 'mapSaveStatus';

      $this.parent.launch('server_msg',null, null,data);
    });
  });

  this.parent.EventEmitter.trigger('saveMap');

};

Handlebars.registerPartial("attribs", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  "
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "='"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "'\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.attribs : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true}));

Handlebars.registerPartial("collapse_panel", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)));
  },"3":function(depth0,helpers,partials,data) {
  return "default";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "<div class='panel panel-";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.type : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.program(3, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "'>\n  <div class='panel-heading' role=\"tab\" id=\"heading"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <h4 class='panel-title'>\n      <a data-toggle='collapse' data-parent='#"
    + escapeExpression(lambda((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "' href='#collapse"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' aria-expanded=\"false\" aria-controls='collapse"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "'>\n        ";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n      </a>\n    </h4>\n  </div>\n  <div id='collapse"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "'>\n    <div class='panel-body' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' ";
  stack1 = this.invokePartial(partials.attribs, '', 'attribs', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\n      ";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n  </div>\n</div>\n";
},"usePartial":true,"useData":true,"useDepths":true}));

Handlebars.registerPartial("dropdown", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.dropdown_content, '      ', 'dropdown_content', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<li class='dropdown'>\n  <a class='dropdown-toggle' data-toggle='dropdown'>\n    "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + " <span class='caret'></span>\n  </a>\n  <ul class='dropdown-menu' role='menu'>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.items : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </ul>\n</li>\n";
},"usePartial":true,"useData":true}));

Handlebars.registerPartial("dropdown_content", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.disabled : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <li class='disabled navLink'><a class='ui-action' ui-action='"
    + escapeExpression(((helper = (helper = helpers['ui-action'] || (depth0 != null ? depth0['ui-action'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ui-action","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <li class='navLink'><a class='ui-action' ui-action='"
    + escapeExpression(((helper = (helper = helpers['ui-action'] || (depth0 != null ? depth0['ui-action'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ui-action","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"6":function(depth0,helpers,partials,data) {
  return "  <li class='divider'></li>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0['ui-action'] : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true}));

Handlebars.registerPartial("input", Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class='col-sm-12'>\n  <label for='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' class='col-sm-4 control-label'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</label>\n  <div class='col-sm-"
    + escapeExpression(((helper = (helper = helpers.cols || (depth0 != null ? depth0.cols : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cols","hash":{},"data":data}) : helper)))
    + "'>\n    <input type='text' class='form-control' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' placeholder='"
    + escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"placeholder","hash":{},"data":data}) : helper)))
    + "', value='"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'></input>\n  </div>\n</div>\n";
},"useData":true}));

Handlebars.registerPartial("select", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.select_option, '        ', 'select_option', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='col-sm-12'>\n  <label for='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' class='col-sm-4 control-label'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</label>\n  <div class='col-sm-"
    + escapeExpression(((helper = (helper = helpers.cols || (depth0 != null ? depth0.cols : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cols","hash":{},"data":data}) : helper)))
    + "'>\n    <select class='form-control' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.option : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </select>\n  </div>\n</div>\n";
},"usePartial":true,"useData":true}));

Handlebars.registerPartial("select_option", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <option value='"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "' selected='selected'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <option value='"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.selected : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true}));

this["UI"] = this["UI"] || {};
this["UI"]["Views"] = this["UI"]["Views"] || {};

this["UI"]["Views"]["create_layer_form"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.input, '    ', 'input', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='form-horizontal' role='form' id='createLayerForm'>\n  <div class='form-group'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.name : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n</div>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["create_load_map_form"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.select, '    ', 'select', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='form-horizontal' role='form' id='loadMapForm'>\n  <div class='form-group'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.map : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n</div>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["create_map_form"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.input, '      ', 'input', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.select, '      ', 'select', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='form-horizontal' role='form' id='createMapForm'>\n  <div class='form-group'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.name : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </div>\n  <div class='form-group'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.width : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </div>\n  <div class='form-group'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.height : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </div>\n  <div class='form-group'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.tileset : stack1), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n</div>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["button"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.option || (depth0 != null ? depth0.option : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"option","hash":{},"data":data}) : helper)));
  },"3":function(depth0,helpers,partials,data) {
  return "default";
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "btn-"
    + escapeExpression(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"size","hash":{},"data":data}) : helper)));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<a type='button' class='btn btn-";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.option : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.size : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " "
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' ";
  stack1 = this.invokePartial(partials.attribs, '', 'attribs', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += " >";
  stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</a>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["collapse_panel_group"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.collapse_panel, '  ', 'collapse_panel', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"panel-group\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" role=\"tablist\" aria-multiselectable=\"true\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.panel : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["div"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='"
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' ";
  stack1 = this.invokePartial(partials.attribs, '', 'attribs', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += " >";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["li"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "'";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<li class='"
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)))
    + "' ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.id : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\n  ";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n</li>\n";
},"useData":true});



this["UI"]["Views"]["modal"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"modal fade\" id=\"mainModal\">\n  <div class='modal-dialog'>\n    <div class='modal-content'>\n      <div class='modal-header'>\n        <h4>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\n      </div>\n      <div class='modal-body' id='modalBody'>\n        ";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n      </div>\n      <div class='modal-footer' id='modalFooter'>\n        ";
  stack1 = ((helper = (helper = helpers.footer || (depth0 != null ? depth0.footer : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"footer","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});



this["UI"]["Views"]["panel"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)));
  },"3":function(depth0,helpers,partials,data) {
  return "default";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='panel panel-";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.type : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "' id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class='panel-heading'>\n      ";
  stack1 = ((helper = (helper = helpers.head || (depth0 != null ? depth0.head : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"head","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n    </div>\n    <div class='panel-body'>\n      ";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n</div>\n";
},"useData":true});



this["UI"]["Views"]["server_msg"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)));
  },"3":function(depth0,helpers,partials,data) {
  return "success";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class='alert alert-";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.type : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "'\n  role='alert' style='position:absolute;top:20px;left:20px;z-index:10000'>\n  <button type='button' class='close' data-dismiss='alert'>\n    <span class='glyphicon glyphicon-remove'></span>\n  </button>\n  "
    + escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper)))
    + "\n</div>\n";
},"useData":true});



this["UI"]["Views"]["tabs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <li class='"
    + escapeExpression(((helper = (helper = helpers.tabClass || (depth0 != null ? depth0.tabClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabClass","hash":{},"data":data}) : helper)))
    + "' role='presentation'>\n    <a href='#"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' data-toggle='tab' aria-controls='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n  </li>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "  <div role='tabpanel' class='tab-pane "
    + escapeExpression(((helper = (helper = helpers.paneClass || (depth0 != null ? depth0.paneClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"paneClass","hash":{},"data":data}) : helper)))
    + "' id="
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + ">";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<ul class='nav nav-tabs class="
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)))
    + "' role='tablist' id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tab : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</ul>\n<div class='tab-content'>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tab : depth0), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});



this["UI"]["Views"]["ul"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<ul class=' list-group "
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' ";
  stack1 = this.invokePartial(partials.attribs, '', 'attribs', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += " >";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["layerListItem"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<h4 class='show'><span class='label label-default layerName'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span></h4>\n<div class='form-group hidden'>\n  <input type='text' class='form-control layerNameFormItem' placeholder='Layer Name'>\n</div>\n<div class='btn-group'>\n  <button class='btn btn-danger deleteLayer'>\n    <span class='glyphicon glyphicon-remove-circle'></span>\n  </button>\n  <button class='btn btn-default active setVisibilityLayer' data-toggle='button' aria-pressed='true',autocomplete='off'>\n    <span class='glyphicon glyphicon-eye-open'></span>\n  </button>\n  <button class='btn btn-default makeLayerActive active'>\n    <span class='glyphicon glyphicon-pencil'></span>\n  </button>\n</div>\n";
},"useData":true});



this["UI"]["Views"]["mainBody"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id='container' class='container-fluid'>\n  <div class='row' id='mainRow'>\n    <div id='mainPanel' class='col-md-12'></div>\n  </div>\n</div>\n";
  },"useData":true});



this["UI"]["Views"]["navbar"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.dropdown, '          ', 'dropdown', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='navbar navbar-default navbar-fixed-top' role='navigation' id='navigation'>\n  <div class='continaer-fluid'>\n    <div class=\"collapse navbar-collapse\">\n      <ul class='nav navbar-nav navbar-left'>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.dropdown : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </ul>\n    </div>\n  </div>\n</div>\n";
},"usePartial":true,"useData":true});



this["UI"]["Views"]["toolListItem"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button class='btn btn-default tool' ui-action ='"
    + escapeExpression(((helper = (helper = helpers['ui-action'] || (depth0 != null ? depth0['ui-action'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ui-action","hash":{},"data":data}) : helper)))
    + "'>\n  <img class='center-block' src='"
    + escapeExpression(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"image","hash":{},"data":data}) : helper)))
    + "' width='50px' height='50px'>\n  "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\n</button>\n";
},"useData":true});
UI.LaunchPad = function(parent){
  this.parent = parent;
};

UI.LaunchPad.prototype.constructor = UI.LaunchPad;

UI.LaunchPad.prototype.launchMainPanel = function(callback){
  //TODO: I need the zoom thing as well
  var sidebarButton = {
    option : 'default',
    size : 'lg',
    id : 'toggleSidebar',
    text : ' <span class="glyphicon glyphicon-th-list"></span>Side Panel'//the handlebars boss would be mad
  };

  var playGameButton = {
    option : 'success',
    size : 'lg',
    id : 'playGame',
    text : 'Play Game',
    attribs : [{
      key : 'ui-action',
      value: 'playGame'
    }],
    class: 'pull-right'
  };

  var panels = this.parent.Views.collapse_panel_group({
    id : 'sidbarPanel',
    panel :[
    {
      id : 'tilesetContainer',
      title : 'Tileset',
      content : this.parent.Views.div({
        id : 'tileset',
        attribs : [{
          key :'style',
          value:'overflow:auto'
        }]
      })
    },
    {
      id : 'toolsContainer',
      title : 'Tools',
      content : this.parent.Views.div({
        id : 'tools',
        attribs : [{
          key :'style',
          value:'overflow:auto'
        }]
      })
    },
    {
      id : 'layersContainer',
      title : 'Layers',
      content : this.parent.Views.button({
        option :'primary',
        class:'btn-block',
        id:'newLayer',
        text : 'New Layer'
      })+
      this.parent.Views.ul({
        id : 'layers',
        attribs : [{
          key :'style',
          value:'overflow:auto'
        }]
      })
    }
    ]
  });

  var content =
  this.parent.Views.div({
    id: 'sidebarPanel',
    class:'col-xs-4',
    attribs : [{
      key : 'style',
      value : 'overflow:auto'
    }],
    content : panels
  })+
  this.parent.Views.div({
    id: 'mainContentPanel',
    class:'col-xs-8',
    attribs : [{
      key : 'style',
      value : 'overflow:auto'
    }],
    content : this.parent.Views.div({
      id : 'grid'
    })
  });

  var contentOptions = {
    class: 'col-xs-12',
    id : 'editorContent',
    content : content
  };

  var panel = {
    head :this.parent.Views.button(sidebarButton)+this.parent.Views.button(playGameButton),
    content : this.parent.Views.div(contentOptions)
  };

  callback(panel);
};

UI.LaunchPad.prototype._launchMainPanel = function(){
  var $this = this;

  /* Layer Actions */
  //This makes sorting the layers possible
  $('#layers').sortable({
    update: function( event, ui) {
      var layers = $('#layers').children();
      var order = [];

      $(layers).each(function(index,layer){
        order.push($(layer).attr('id'));
      });

      $this.parent.EventEmitter.trigger('orderLayers',[order]);
    }
  });

  //listens for layer to be set this solutions reflects what the game is telling it
  this.parent.EventEmitter.on('activeLayerSet', function(layer){
    $('.makeLayerActive').removeClass('active');
    $('#'+layer.id+' .makeLayerActive').addClass('active');
  });

  $('#newLayer').on('click', function(){
    this.parent.EventEmitter.trigger('newLayer');
  }.bind(this));


  /*Tools*/
  $('#tools').delegate('.tool','click', function(){
    var action = $(this).attr('ui-action');
    console.log(action);
    $this.parent.EventEmitter.trigger('setActiveTool',[action]);
  });

  this.parent.EventEmitter.on('activeToolSet', function(tool){
    var tools = $('#tools .tool');
    tools.removeClass('active');
    tools.each(function(index,_tool){
      if($(_tool).attr('ui-action') === tool){
        $(_tool).addClass('active');
      }
    });
  });

  /* Side Bar Toggle */
  $('#toggleSidebar').on('click', function(){
    $('#sidebarPanel').toggleClass('col-xs-4').toggleClass('hidden');
    $('#mainContentPanel').toggleClass('col-xs-8').toggleClass('col-xs-12');
  });


//Other
  $('#sidebarPanel').css('max-height',(window.innerHeight-180)+'px');
  $('#mainContentPanel').css('max-height',(window.innerHeight-180)+'px');
};

UI.LaunchPad.prototype.layerListItem = function(callback,into,layer){
  var content = this.parent.Views.layerListItem(
    {
      name:layer.name
    }
  );
  callback({
    id : layer.id,
    content : content,
    class : 'list-group-item'
  },into,layer);
};

UI.LaunchPad.prototype._layerListItem = function(data,into){
  var $this = this;

  $('#'+data.id).prependTo(into);
  $('#'+data.id +' .setVisibilityLayer').on('click', function(){

    $this.parent.EventEmitter.trigger('toggleLayer',[data.id]);

  });

  $('#'+data.id +' .makeLayerActive').on('click', function(){

  //  $('.makeLayerActive').removeClass('active');
  //  $(this).addClass('active');

    $this.parent.EventEmitter.trigger('makeLayerActive',[data.id]);
  });

  $('#mainModal').modal('hide');
};

UI.LaunchPad.prototype.loadMap = function(callback){
  var maps = this.parent.data.Maps;
  var mapOptions = [];

  for(var i = 0; i < maps.length; i++){
    mapOptions.push({
      title : maps[i].name,
      value : maps[i].id
    });
  }

  var formContent = {
    form : {
      map : [{
        name : 'id',
        title : 'Map',
        cols : '6',
        option : mapOptions
      }]
    }
  };

  var modalContent = {
    title : 'Create New Map',
    content : this.parent.Views.create_load_map_form(formContent),//this is unique to this modal
    footer : this.parent.Views.button({
      option :'primary',
      size:'',
      class:'',
      id:'loadMap',
      text : 'Load Map'
    })
  };
  callback(modalContent);
};

UI.LaunchPad.prototype._loadMap = function(){
  $('#mainModal').modal('show');
  var $this = this;
  $('#loadMap').off('click');//turns it off so you will not have multiple clicks
  $('#loadMap').one('click', function(){
    $this.parent.collect('loadMapForm','loadTheMap');
  });
};

UI.LaunchPad.prototype.navbar = function(callback){
  var dropdowns = {
    dropdown : {
      file : {
        title : 'File',
        items : [
        {title:'New Map','ui-action':'newMap'},
        {title:'Load Map','ui-action':'loadMap'},
        {title:'divider'},
      //  {title:'Save Map','ui-action':'saveMap', disabled:'disabled'}
        {title:'Save Map','ui-action':'saveMap'}
        ]
      },
      tilesetOption : {
        title : 'Tilesets',
        items : [
        {title:'New Tileset', 'ui-action' :'newTileset'}
        ]
      }
    }
  };
  callback(dropdowns);
};

//Any link that is a navlink will now trigger the action for now it is
//setup here but that can be pulled out
UI.LaunchPad.prototype._navbar = function(){
  
};

UI.LaunchPad.prototype.newLayer = function(callback){
  console.log('It got to the launcher');
  var formContent = {
    form : {
      name : [{
        name : 'name',
        title : 'Layer Name',
        placeholder : 'Layer Name',
        value : 'New Layer',
        cols : '6'
      }]
    }
  };

  var modalContent = {
    title : 'Create New Layer',
    content : this.parent.Views.create_layer_form(formContent),//this is unique to this modal
    footer : this.parent.Views.button({
      option :'primary',
      size:'',
      class:'',
      id:'createLayer',
      text : 'Create Layer'
    })
  };

  callback(modalContent);
};

UI.LaunchPad.prototype._newLayer = function(){
  $('#mainModal').modal('show');
  var $this = this;
  $('#createLayer').off('click');//turns it off so you will not have multiple clicks
  $('#createLayer').one('click', function(){
    $this.parent.collect('createLayerForm','createLayer');
  });
};

UI.LaunchPad.prototype.newMap = function(callback){

  //TODO: this should be pulled from the server most likey
  var tilesets = this.parent.data.Tilesets;
  var tilesetOptions = [];
  for(var i = 0; i < tilesets.length; i++){
    tilesetOptions.push({
      title : tilesets[i].name,
      value : tilesets[i]._id
    });
  }

  var formContent = {
    form : {
      name : [{
        id : 'randNameId',
        name : 'name',
        title : 'Map Name',
        placeholder : 'My New Map',
        value : 'New Map',
        cols : '6'
      }],
      width : [{
        id : 'randWidthId',
        name: 'tilesx',
        title : 'Width(in Tiles)',
        placeholder : 'Y',
        value : '16',
        cols : '2'
      }],
      height : [{
        name : 'tilesy',
        title : 'Height (In Tiles)',
        placeholder : 'X',
        value : '16',
        cols : '2'
      }],
      tileset : [{
        name : 'tilesetId',
        title : 'Tileset',
        cols : '6',
        option : tilesetOptions
      }]
    }
  };

  var modalContent = {
    title : 'Create New Map',
    content : this.parent.Views.create_map_form(formContent),//this is unique to this modal
    footer : this.parent.Views.button({
      option :'primary',
      size:'',
      class:'',
      id:'createMap',
      text : 'Create Map'
    })
  };

  callback(modalContent);

};

UI.LaunchPad.prototype._newMap = function(){
  $('#mainModal').modal('show');
  var $this = this;
  $('#createMap').off('click');//turns it off so you will not have multiple clicks
  $('#createMap').one('click', function(){
    $this.parent.collect('createMapForm','createMap');
  });
};

UI.LaunchPad.prototype.server_msg = function(callback, into, data){
  console.log(data);
  var msgData = {
    id: data.id,
    type : data.status,
    message : data.message
  };

  callback(msgData,into,data);
};

UI.LaunchPad.prototype._server_msg = function(data){

  $("#"+data.id).fadeTo(2000, 500).slideUp(500, function(){
    $("#"+data.id).alert('close');
  });
};

UI.LaunchPad.prototype.toolListItem = function(callback,into,tool){
  var content = this.parent.Views.toolListItem(
    {
      name:tool.name,
      'ui-action' : tool.name,
      image : tool.image,
      title : tool.title
    }
  );
  callback({
    id : tool.id,
    content : content,
    class : 'pull-left'
  },into,tool);
};

UI.LaunchPad.prototype._toolListItem = function(data,into){

};

//# sourceMappingURL=UI.combined.js.map