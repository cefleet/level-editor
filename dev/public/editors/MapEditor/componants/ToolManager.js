MapEditor.ToolManager  = function(parent){
  this.parent = parent;
  this.EventEmitter = this.parent.EventEmitter;
  this.tools = {};

  return this;
};

MapEditor.ToolManager.prototype = {

  create : function(options){
    console.log(this);
    var t = new MapEditor.Tool(options);
    this.tools[t.id] = t;
    //this.events.triggerCreated.dispatch(t);
    this.EventEmitter.trigger('toolCreated', t);
  }
};

MapEditor.ToolManager.prototype.constructor = MapEditor.ToolManager;
