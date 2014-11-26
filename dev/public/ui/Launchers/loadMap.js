UI.LaunchPad.prototype.loadMap = function(callback){
  var maps = this.parent.data.Maps;
  var mapOptions = [];

  for(var i = 0; i < maps.length; i++){
    mapOptions.push({
      title : maps[i].name,
      value : maps[i].id
    });
  }

  var formContent = {
    form : {
      map : [{
        name : 'id',
        title : 'Map',
        cols : '6',
        option : mapOptions
      }]
    }
  };

  var modalContent = {
    title : 'Create New Map',
    content : this.parent.Views.create_load_map_form(formContent),//this is unique to this modal
    footer : this.parent.Views.button({
      option :'primary',
      size:'',
      class:'',
      id:'loadMap',
      text : 'Load Map'
    })
  };
  callback(modalContent);
};

UI.LaunchPad.prototype._loadMap = function(){
  $('#mainModal').modal('show');
  var $this = this;
  $('#loadMap').off('click');//turns it off so you will not have multiple clicks
  $('#loadMap').one('click', function(){
    $this.parent.collect('loadMapForm','loadTheMap');
  });
};
