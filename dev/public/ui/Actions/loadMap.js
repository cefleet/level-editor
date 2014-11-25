UI.Actions.prototype.loadMap = function(){
  $('#mainModal').remove();
  this.parent.launch('modal', null, 'loadMap');
};
