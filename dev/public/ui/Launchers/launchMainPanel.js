UI.LaunchPad.prototype.launchMainPanel = function(callback){
  //TODO: I need the zoom thing as well
  var sidebarButton = {
    option : 'primary',
    size : 'sm',
    id : 'toggleSidebar',
    text : 'Side Panel'
  };

  var panels = this.parent.Views.collapse_panel_group({
    id : 'sidbarPanel',
    panel :[
    {
      id : 'tilesetContainer',
      title : 'Tileset',
      content : this.parent.Views.div({
        id : 'tileset',
        attribs : [{
          key :'style',
          value:'overflow:auto'
        }]
      })
    },
    {
      id : 'toolsContainer',
      title : 'Tools',
      content : this.parent.Views.div({
        id : 'tools',
        attribs : [{
          key :'style',
          value:'overflow:auto'
        }]
      })
    },
    {
      id : 'layersContainer',
      title : 'Layers',
      content : this.parent.Views.button({
        option :'primary',
        class:'btn-block',
        id:'newLayer',
        text : 'New Layer'
      })+
      this.parent.Views.ul({
        id : 'layers',
        attribs : [{
          key :'style',
          value:'overflow:auto'
        }]
      })
    }
    ]
  });

  var content =
  this.parent.Views.div({
    id: 'sidebarPanel',
    class:'col-xs-4',
    attribs : [{
      key : 'style',
      value : 'overflow:auto'
    }],
    content : panels
  })+
  this.parent.Views.div({
    id: 'mainContentPanel',
    class:'col-xs-8',
    attribs : [{
      key : 'style',
      value : 'overflow:auto'
    }],
    content : this.parent.Views.div({
      id : 'grid'
    })
  });

  var contentOptions = {
    class: 'col-xs-12',
    id : 'editorContent',
    content : content
  };

  var panel = {
    head :this.parent.Views.button(sidebarButton),
    content : this.parent.Views.div(contentOptions)
  };

  callback(panel);
};

UI.LaunchPad.prototype._launchMainPanel = function(){
  var $this = this;

  //This makes sorting the layers possible
  $('#layers').sortable({
    update: function( event, ui) {
      var layers = $('#layers').children();
      var order = [];

      $(layers).each(function(index,layer){
        order.push($(layer).attr('id'));
      });

      $this.parent.EventEmitter.trigger('orderLayers',[order]);
    }
  });

  //listens for layer to be set this solutions reflects what the game is telling it
  this.parent.EventEmitter.on('activeLayerSet', function(layer){
    $('.makeLayerActive').removeClass('active');
    $('#'+layer.id+' .makeLayerActive').addClass('active');
  });


  $('#toggleSidebar').on('click', function(){
    $('#sidebarPanel').toggleClass('col-xs-4').toggleClass('hidden');
    $('#mainContentPanel').toggleClass('col-xs-8').toggleClass('col-xs-12');
  });

  $('#newLayer').on('click', function(){
    this.parent.EventEmitter.trigger('newLayer');
  }.bind(this));

  $('#sidebarPanel').css('max-height',(window.innerHeight-180)+'px');
  $('#mainContentPanel').css('max-height',(window.innerHeight-180)+'px');
};
