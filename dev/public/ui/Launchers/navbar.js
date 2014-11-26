UI.LaunchPad.prototype.navbar = function(callback){
  var dropdowns = {
    dropdown : {
      file : {
        title : 'File',
        items : [
        {title:'New Map','ui-action':'newMap'},
        {title:'Load Map','ui-action':'loadMap'},
        {title:'divider'},
      //  {title:'Save Map','ui-action':'saveMap', disabled:'disabled'}
        {title:'Save Map','ui-action':'saveMap'}
        ]
      },
      tilesetOption : {
        title : 'Tilesets',
        items : [
        {title:'New Tileset', 'ui-action' :'newTileset'}
        ]
      }
    }
  };
  callback(dropdowns);
};

//Any link that is a navlink will now trigger the action for now it is
//setup here but that can be pulled out
UI.LaunchPad.prototype._navbar = function(){
  /*
  var $this = this;
  $('.navLink a').each(function(e){
    var action = $(this).attr('ui-action');

    //WTH IS THIS?
    //This has been replaced with the intercom
    if(!action || !$this.parent.Actions[action]) {
          console.warn('There is no action associated with the '+action+' listener.'+
          'If you didn\'t set one up manually this link will do nothing.');
    } else {
      $(this).on('click', function(){
        $this.parent.Actions[action]();
      });
    }
  });
  */

};
