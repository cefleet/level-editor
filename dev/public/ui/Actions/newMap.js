UI.Actions.prototype.newMap = function(){
  $('#mainModal').remove();
  this.parent.launch('modal', null, 'newMap');
};
