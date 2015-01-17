UI.LaunchPad.prototype.loadPlayGame = function(callback){
  var modalContent = {
    title : '',
    content : this.parent.Views.div({id:'gameContainer'})
  };

  callback(modalContent);
};


UI.LaunchPad.prototype._loadPlayGame = function(){
  //TODO
  this.parent.EventEmitter.trigger('playGame');

  //Listen out for the modal to close
  $('#lgModal').on('hidden.bs.modal', function(){
    this.parent.EventEmitter.trigger('endGame');
  }.bind(this));

  //open up the modal
  $('#lgModal').modal('show');

};
