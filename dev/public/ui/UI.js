UI = function(options){
	options = options || {};
	this.EventEmitter = options.EventEmitter || new EventEmitter();
	this.Actions = new UI.Actions(this);
  this.Views = UI.Views;
  //views are added by handlebars/grunt

  this.buildUI();
  return this;
};

UI.prototype = {
  buildUI : function(){

    //TODO get this from a config file
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
            {title:'New Tileset', action :'newTileset$'}
          ]
        }
      }
    };

    $(document.body).append([
      this.Views.navbar(dropdowns)
    ]);
  },

  //This is only a test but it's pretty close to working
  testModalContent : function(){
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
        content : this.Views.create_map_form(formContent),//this is unique to this modal
        footer : 'Add something here'
    };

    $(document.body).append(this.Views.modal(modalContent));
    $('#mainModal').modal('show');
  }
};

UI.prototype.constructor = UI;
