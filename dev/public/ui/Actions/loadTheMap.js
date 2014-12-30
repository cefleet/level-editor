UI.Actions.prototype.loadTheMap = function(data){
    var map;
    for(var i = 0; i < this.parent.data.Maps.length; i++){
      if(this.parent.data.Maps[i].id == data.id){
        map = this.parent.data.Maps[i];
      }
    }

    for(i = 0; i < this.parent.data.Tilesets.length; i++){
      if(this.parent.data.Tilesets[i]._id == map.tilesetId){
        map.tileset = this.parent.data.Tilesets[i];
      }
    }
    //empties out the panel
    $('#mainPanel').empty();
    this.parent.launch('panel', 'mainPanel', 'launchMainPanel', map);
    $('#mainModal').modal('hide');

    this.parent.EventEmitter.trigger('loadMap',[map]);
};
