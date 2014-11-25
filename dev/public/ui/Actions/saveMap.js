UI.Actions.prototype.saveMap = function(){
  var $this = this;
  this.parent.EventEmitter.once('mapReadyForSave',function(map){
    $this.parent.data.Maps[map.id] = map;//saves it to memory

    map.tilemap = JSON.stringify(map.tilemap);
    $.post('save_map',map).done(function(data){
      data.id = 'mapSaveStatus';
      
      $this.parent.launch('server_msg',null, null,data);
    });
  });

};
