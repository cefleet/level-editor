UI.Actions.prototype.createMap = function(data){
  this.parent.launch('panel', 'mainPanel', 'launchMainPanel');

  $('#mainModal').modal('hide');

  var tileset;
  for(var i = 0; i < this.parent.data.Tilesets.length; i++){
    if(this.parent.data.Tilesets[i]._id === data.tilesetId){
      tileset = this.parent.data.Tilesets[i];
    }
  }
  tileset.id = tileset._id;
  tileset.container = 'tileset';
  var send = [
  data.name,
  {
    tilesx : Number(data.tilesx),
    tilesy : Number(data.tilesy),
    tilewidth : tileset.tilewidth, //TODO make these not needed
    tileheight : tileset.tileheight //TODO make these not needed
  },
  tileset
  ];

    //This sends out the event so the editor can begin its work
  this.parent.EventEmitter.trigger('createMap',send);
};
