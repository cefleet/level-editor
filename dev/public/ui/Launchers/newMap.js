UI.LaunchPad.prototype.newMap = function(callback){

  //TODO this should be pulled from the server most likey
  var tilesets = this.parent.data.Tilesets;
  var tilesetOptions = [];
  for(var i = 0; i < tilesets.length; i++){
    tilesetOptions.push({
      title : tilesets[i].name,
      value : tilesets[i]._id
    });
  }

  var formContent = {
    form : {
      name : [{
        id : 'randNameId',
        name : 'name',
        title : 'Map Name',
        placeholder : 'My New Map',
        value : 'New Map',
        cols : '6'
      }],
      width : [{
        id : 'randWidthId',
        name: 'tilesx',
        title : 'Width(in Tiles)',
        placeholder : 'Y',
        value : '16',
        cols : '2'
      }],
      height : [{
        name : 'tilesy',
        title : 'Height (In Tiles)',
        placeholder : 'X',
        value : '16',
        cols : '2'
      }],
      tileset : [{
        name : 'tilesetId',
        title : 'Tileset',
        cols : '6',
        option : tilesetOptions
      }]
    }
  };

  var modalContent = {
    title : 'Create New Map',
    content : this.parent.Views.create_map_form(formContent),//this is unique to this modal
    footer : this.parent.Views.button({
      option :'primary',
      size:'',
      class:'',
      id:'createMap',
      text : 'Create Map'
    })
  };

  callback(modalContent);
  
};

UI.LaunchPad.prototype._newMap = function(){
  $('#mainModal').modal('show');
  var $this = this;
  $('#createMap').off('click');//turns it off so you will not have multiple clicks
  $('#createMap').one('click', function(){
    $this.parent.collect('createMapForm','createMap');
  });
};
