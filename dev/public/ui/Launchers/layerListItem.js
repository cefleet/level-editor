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
  var $this = this;
//  console.log(data);
//  console.log('Hey you need to register the clicks for the layer buttons');

  $('#'+data.id +' .setVisibilityLayer').on('click', function(){
  //  console.log(this);
    $this.parent.EventEmitter.trigger('toggleLayer',[data.id]);
  });

  $('#'+data.id +' .makeLayerActive').on('click', function(){
    $('.makeLayerActive').removeClass('active');
  //  console.log(this);
    $(this).addClass('active');
    $this.parent.EventEmitter.trigger('makeLayerActive',[data.id]);
  });

  $('#mainModal').modal('hide');
};
