UI.LaunchPad.prototype.toolListItem = function(callback,into,tool){
  var content = this.parent.Views.toolListItem(
    {
      name:tool.name,
      'ui-action' : tool.name,
      image : tool.image,
      title : tool.title
    }
  );
  callback({
    id : tool.id,
    content : content,
    class : 'pull-left'
  },into,tool);
};

UI.LaunchPad.prototype._toolListItem = function(data,into){

};
