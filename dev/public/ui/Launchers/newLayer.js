UI.LaunchPad.prototype.newLayer = function(callback){
  console.log('It got to the launcher');
  var formContent = {
    form : {
      name : [{
        name : 'name',
        title : 'Layer Name',
        placeholder : 'Layer Name',
        value : 'New Layer',
        cols : '6'
      }]
    }
  };

  var modalContent = {
    title : 'Create New Layer',
    content : this.parent.Views.create_layer_form(formContent),//this is unique to this modal
    footer : this.parent.Views.button({
      option :'primary',
      size:'',
      class:'',
      id:'createLayer',
      text : 'Create Layer'
    })
  };

  callback(modalContent);
};

UI.LaunchPad.prototype._newLayer = function(){
  $('#mainModal').modal('show');
  var $this = this;
  $('#createLayer').off('click');//turns it off so you will not have multiple clicks
  $('#createLayer').one('click', function(){
    $this.parent.collect('createLayerForm','createLayer');
  });
};
