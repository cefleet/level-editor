MapEditor.Trigger = function(options){
  options = options || {};
  this.id = options.id || $uid();//no longer a viable option
  this.name = options.name || 'tool';
  this.image = options.image || 'tool.png';

  return this;
};
