MapEditor.LayerManager  = function(parent){
  this.parent = parent;
  this.EventEmitter = this.parent.EventEmitter;
  this.layers = {};

  return this;
};

MapEditor.LayerManager.prototype = {

  create : function(options){
    console.log(this);
    var t = new MapEditor.Layer(options);
    this.layers[t.id] = t;
    //this.events.triggerCreated.dispatch(t);
    this.EventEmitter.trigger('layersCreated', t);
  }
};

MapEditor.LayerManager.prototype.constructor = MapEditor.LayerManager;
