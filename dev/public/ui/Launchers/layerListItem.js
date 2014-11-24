UI.LaunchPad.prototype.layerListItem = function(callback,into,layer){
  var content = this.parent.Views.layerListItem(
    {
      name:layer.name
    }
  );
  callback({
    id : layer.id,
    content : content
  },into,layer);
};

UI.LaunchPad.prototype._layerListItem = function(data){
  console.log(data);
  console.log('Hey you need to register the clicks for the layer buttons');
  $('#mainModal').modal('hide');
};
