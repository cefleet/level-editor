UI.LaunchPad.prototype.navbar = function(callback){
  var dropdowns = {
    dropdown : {
      file : {
        title : 'File',
        items : [
        {title:'New Map',action:'newMap'},
        {title:'Load Map',action:'loadMap'},
        {title:'divider'},
        {title:'Save Map',action:'saveMap', disabled:'disabled'}
        ]
      },
      tilesetOption : {
        title : 'Tilesets',
        items : [
        {title:'New Tileset', action :'newTileset'}
        ]
      }
    }
  };
  callback(dropdowns);
};

//Any link that is a navlink will now trigger the action for now it is
//setup here but that can be pulled out
UI.LaunchPad.prototype._navbar = function(){
  var $this = this;
  $('.navLink a').each(function(e){
    var action = $(this).attr('action');

    if(action){
      //this can be setup in another location
      if($this.parent.Actions[action]) {
        //because it launches in actions it needs to bind to it
        $this.parent.EventEmitter.on(action,
          $this.parent.Actions[action].bind($this.parent.Actions));
        } else {
          console.warn('There is no action associated with the '+action+' listener.'+
          'If you didn\'t set one up manually this link will do nothing.');
        }

        $(this).on('click', function(){
          $this.parent.EventEmitter.trigger(action);
        });
      }
    });
};
