MapEditor.Tool = function(options,parent){
  options = options || {};
  this.parent = parent;
  this.name = options.name || 'tool';
  this.image = options.image || 'img/ui/tool.png';
  this.title = options.title || 'Tool';
  this.parent.parent.grid.game.load.image(this.name, this.image);
  return this;
};
