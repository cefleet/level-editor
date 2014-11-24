UI = function(options){
	options = options || {};
	this.EventEmitter = options.EventEmitter || new EventEmitter();
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
	launch : function(view,into,launcher,callback,working){
		into = into || document.body;
		launcher = launcher || view;
		working = working || false; //doesn't do anything yet

		//If there is no view with that name this this function shall not pass
		if(typeof this.Views[view] !== 'function'){
			throw "There is no view named "+view;
		}

		var launch = function(options,into){
			if(typeof into === 'string'){
				into = '#'+into.replace('#',''); //this seems reduntant but it removes a has if there is one and adds it back
			}
			$(into).append(this.Views[view](options));
			if(typeof this.LaunchPad['_'+launcher] ==='function'){
				this.LaunchPad['_'+launcher]();
			}
		}.bind(this);

		callback = callback || function(options, newInto){
			into = newInto || into;
			launch(options, into);
		}.bind(this);

		if(typeof this.LaunchPad[launcher] === 'function'){
			this.LaunchPad[launcher](callback,into);
		} else {
			launch(null,into);
		}
	},

	//This is a helper to collect form content
	//forms can be an array of element id or the name of the parent container
	collect : function(forms,next,useIds){
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

		this.Actions[next](data);
	},

	processData : function(){
		console.log(this.data);
	}
};

UI.prototype.constructor = UI;

UI.Actions = function(parent){

	this.parent = parent  || {};
	this.Views = UI.Views;
	return this;
};

UI.Actions.prototype.createMap = function(data){
  this.parent.launch('panel', 'mainPanel', 'launchMainPanel');
  //this.parent.launch('panel','sidePanel', 'launchToolPanel');

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
    tilewidth : tileset.tilewidth, //TODO make these not needed
    tileheight : tileset.tileheight //TODO make these not needed
  },
  tileset
  ];

    //This sends out the event so the editor can begin its work
  this.parent.EventEmitter.trigger('createMap',send);
};

UI.Actions.prototype.loadContainers = function(){
  this.parent.launch('navbar');
  this.parent.launch('mainBody');
};

UI.Actions.prototype.loadMap = function(){
  console.log('Launch Load Map Modal');
};

UI.Actions.prototype.newMap = function(){
  this.parent.launch('modal', null, 'newMap');
};

UI.Actions.prototype.newTileset = function(){
  console.log('Create New Tileset');
};

UI.Actions.prototype.saveMap = function(){
  console.log('Save The Map');
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
  return "    <li class='disabled navLink'><a action='"
    + escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"action","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <li class='navLink'><a action='"
    + escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"action","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"6":function(depth0,helpers,partials,data) {
  return "  <li class='divider'></li>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.action : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(6, data),"data":data});
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
  return buffer + " >"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</a>\n";
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
UI.LaunchPad = function(parent){
  this.parent = parent;
};

UI.LaunchPad.prototype.constructor = UI.LaunchPad;

UI.LaunchPad.prototype.launchMainPanel = function(callback){
  //TODO I need the zoom thing as well
  var sidebarButton = {
    option : 'primary',
    size : 'sm',
    id : 'toggleSidebar',
    text : 'Side Panel'
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
      content : this.parent.Views.div({
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
    head :this.parent.Views.button(sidebarButton),
    content : this.parent.Views.div(contentOptions)
  };

  callback(panel);
};

UI.LaunchPad.prototype._launchMainPanel = function(){
  $('#toggleSidebar').on('click', function(){
    $('#sidebarPanel').toggleClass('col-xs-4').toggleClass('hidden');
    $('#mainContentPanel').toggleClass('col-xs-8').toggleClass('col-xs-12');
  });
  $('#sidebarPanel').css('max-height',(window.innerHeight-180)+'px');
  $('#mainContentPanel').css('max-height',(window.innerHeight-180)+'px');
};

UI.LaunchPad.prototype.navbar = function(callback){
  var dropdowns = {
    dropdown : {
      file : {
        title : 'File',
        items : [
        {title:'New Map',action:'newMap'},
        {title:'Load Map',action:'loadMap'},
        {title:'divider'},
        {title:'Save Map',action:'saveMap', disabled:'disabled'}
        ]
      },
      tilesetOption : {
        title : 'Tilesets',
        items : [
        {title:'New Tileset', action :'newTileset'}
        ]
      }
    }
  };
  callback(dropdowns);
};

//Any link that is a navlink will now trigger the action for now it is
//setup here but that can be pulled out
UI.LaunchPad.prototype._navbar = function(){
  var $this = this;
  $('.navLink a').each(function(e){
    var action = $(this).attr('action');

    if(action){
      //this can be setup in another location
      if($this.parent.Actions[action]) {
        //because it launches in actions it needs to bind to it
        $this.parent.EventEmitter.on(action,
          $this.parent.Actions[action].bind($this.parent.Actions));
        } else {
          console.warn('There is no action associated with the '+action+' listener.'+
          'If you didn\'t set one up manually this link will do nothing.');
        }

        $(this).on('click', function(){
          $this.parent.EventEmitter.trigger(action);
        });
      }
    });
};

UI.LaunchPad.prototype.newMap = function(callback){

  //TODO this should be pulled from the server most likey
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

//# sourceMappingURL=UI.combined.js.map