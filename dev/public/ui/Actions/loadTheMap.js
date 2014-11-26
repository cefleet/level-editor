UI.Actions.prototype.loadTheMap = function(data){
    console.log(data);
    var map;
    for(var i = 0; i < this.parent.data.Maps.length; i++){
      if(this.parent.data.Maps[i].id == data.id){
        map = this.parent.data.Maps[i];
      }
    }
    console.log(map);
    for(i = 0; i < this.parent.data.Tilesets.length; i++){
      if(this.parent.data.Tilesets[i]._id == map.tilesetId){
        map.tileset = this.parent.data.Tilesets[i];
      }
    }
    console.log('I need to Emit out the map to load');
    this.parent.launch('panel', 'mainPanel', 'launchMainPanel');
    $('#mainModal').modal('hide');

    this.parent.EventEmitter.trigger('loadMap',[map]);
};
