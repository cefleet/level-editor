MapEditor.Layer = function(options, parent){
  options = options || {};
  this.parent = parent;
  this.name = options.name || 'New Layer';
  this.id = options.id || $uid();

  this.tiles = {};
  this.parent.makeTiles(this);
  this.order = options.order;

  return this;
};
