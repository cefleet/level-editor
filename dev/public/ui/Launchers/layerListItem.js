UI.LaunchPad.prototype.layerListItem = function(callback,into,layer){
  var content = this.parent.Views.layerListItem(
    {
      name:layer.name
    }
  );
  callback({
    id : layer.id,
    content : content,
    class : 'list-group-item'
  },into,layer);
};

UI.LaunchPad.prototype._layerListItem = function(data,into){
  var $this = this;

  $('#'+data.id).prependTo(into);
  $('#'+data.id +' .setVisibilityLayer').on('click', function(){

    $this.parent.EventEmitter.trigger('toggleLayer',[data.id]);

  });

  $('#'+data.id +' .makeLayerActive').on('click', function(){

  //  $('.makeLayerActive').removeClass('active');
  //  $(this).addClass('active');

    $this.parent.EventEmitter.trigger('makeLayerActive',[data.id]);
  });

  $('#mainModal').modal('hide');
};
