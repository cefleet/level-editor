MapEditor.Trigger = function(options){
  options = options || {};
  this.name = options.name || 'tool';
  this.image = options.image || 'tool.png';

  return this;
};
