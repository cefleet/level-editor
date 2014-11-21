//This is just a collection of functions to help launch Views
//it can
UI.LaunchPad = function(parent){
  this.parent = parent;
};

UI.LaunchPad.prototype = {
  navbar : function(callback){
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
  },

  //Any link that is a navlink will now trigger the action for now it is
  //setup here but that can be pulled out
  _navbar : function(){
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
  },

  newMap : function(callback){
    var formContent = {
      form : {
        name : [{
          id : 'mapNameFormItem',
          title : 'Map Name',
          placeholder : 'My New Map',
          value : 'New Map',
          cols : '6'
        }],
        width : [{
          id : 'widthNameFormItem',
          title : 'Width(in Tiles)',
          placeholder : 'Y',
          value : '16',
          cols : '2'
        }],
        height : [{
          id : 'heightNameFormItem',
          title : 'Height (In Tiles)',
          placeholder : 'X',
          value : '16',
          cols : '2'
        }]
      }
    };

    var modalContent = {
      title : 'Create New Map',
      content : this.parent.Views.create_map_form(formContent),//this is unique to this modal
      footer : 'Add something here'
    };

    console.log(modalContent);

    callback(modalContent);
  },

  _newMap : function(){
    $('#mainModal').modal('show');
  }
};

UI.LaunchPad.prototype.constructor = UI.LaunchPad;
