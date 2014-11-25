UI.Actions.prototype.saveMap = function(){
  var $this = this;
  this.parent.EventEmitter.once('mapReadyForSave',function(map){
    $this.parent.data.Maps[map.id] = map;//saves it to memory

    map.tilemap = JSON.stringify(map.tilemap);
    console.log('I need to modify the app.js (node launcher file) so that I can get a return.');
    $.post('save_map',map).done(function(data){
      console.log('Map was saved. I can launch th epretty thing that says that');
    }); //need a return here to launch the map saved or failiure thing
  });

};
