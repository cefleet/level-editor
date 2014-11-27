UI.LaunchPad.prototype.launchMainPanel = function(callback){
  //TODO: I need the zoom thing as well
  var sidebarButton = {
    option : 'default',
    size : 'lg',
    id : 'toggleSidebar',
    text : ' <span class="glyphicon glyphicon-th-list"></span>Side Panel'//the handlebars boss would be mad
  };

  var playGameButton = {
    option : 'success',
    size : 'lg',
    id : 'playGame',
    text : 'Play Game',
    attribs : [{
      key : 'ui-action',
      value: 'playGame'
    }],
    class: 'pull-right'
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
    head :this.parent.Views.button(sidebarButton)+this.parent.Views.button(playGameButton),
    content : this.parent.Views.div(contentOptions)
  };

  callback(panel);
};

UI.LaunchPad.prototype._launchMainPanel = function(){
  var $this = this;

  /* Layer Actions */
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

  $('#newLayer').on('click', function(){
    this.parent.EventEmitter.trigger('newLayer');
  }.bind(this));


  /*Tools*/
  $('#tools').delegate('.tool','click', function(){
    var action = $(this).attr('ui-action');
    console.log(action);
    $this.parent.EventEmitter.trigger('setActiveTool',[action]);
  });

  this.parent.EventEmitter.on('activeToolSet', function(tool){
    var tools = $('#tools .tool');
    tools.removeClass('active');
    tools.each(function(index,_tool){
      if($(_tool).attr('ui-action') === tool){
        $(_tool).addClass('active');
      }
    });
  });

  /* Side Bar Toggle */
  $('#toggleSidebar').on('click', function(){
    $('#sidebarPanel').toggleClass('col-xs-4').toggleClass('hidden');
    $('#mainContentPanel').toggleClass('col-xs-8').toggleClass('col-xs-12');
  });


//Other
  $('#sidebarPanel').css('max-height',(window.innerHeight-180)+'px');
  $('#mainContentPanel').css('max-height',(window.innerHeight-180)+'px');
};
