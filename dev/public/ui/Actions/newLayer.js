UI.Actions.prototype.newLayer = function(){
  $('#mainModal').remove();
  
  this.parent.launch('modal', null, 'newLayer');
};
