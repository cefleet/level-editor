UI.Actions.prototype.createLayer = function(data){
  var send = [
    data.name
  ];

  this.parent.EventEmitter.trigger('createLayer',send);
};
