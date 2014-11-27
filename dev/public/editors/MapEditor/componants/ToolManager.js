MapEditor.ToolManager  = function(parent){
  this.parent = parent;
  this.EventEmitter = this.parent.EventEmitter;
  this.tools = {};
  this.activeTool = '';

  this.listenOutFor = [
  {
    event : 'gridReady',
    action : 'linkToolsToGrid'
  },
  {
    event : 'setActiveTool',
    action : 'setActiveTool'
  }
  ];

  this.parent.Intercom.setupListeners(this);

  return this;
};

MapEditor.ToolManager.prototype = {

  linkToolsToGrid : function(grid){
    grid.tools = this.tools;
    this.EventEmitter.trigger('ToolsLinked');
  },

  create : function(options){
    var t = new MapEditor.Tool(options,this);
    this.tools[t.id] = t;
    this.EventEmitter.trigger('toolCreated', [t]);
  },

  setActiveTool : function(t){
    var tool;
    if(t instanceof MapEditor.Tool){
      tool = t.name;
    } else if(typeof t === 'string') {
      tool = t;
    }

    this.activeTool = tool;
    this.parent.grid.activeTool = this.activeTool;
    this.parent.grid.marker.destroy();
    if(this.activeTool !== 'single'){
      this.parent.grid.marker = this.parent.grid.game.add.sprite(0,0, t);
    } else {
      this.parent.grid.marker = this.parent.grid.game.add.sprite(0,0, '');
    }
    this.parent.grid.marker.width = this.parent.grid.tilewidth;
    this.parent.grid.marker.height = this.parent.grid.tileheight;

    this.EventEmitter.trigger('activeToolSet', [tool]);
  }

};

MapEditor.ToolManager.prototype.constructor = MapEditor.ToolManager;
