UI.LaunchPad.prototype.server_msg = function(callback, into, data){
  console.log(data);
  var msgData = {
    id: data.id,
    type : data.status,
    message : data.message
  };

  callback(msgData,into,data);
};

UI.LaunchPad.prototype._server_msg = function(data){

  $("#"+data.id).fadeTo(2000, 500).slideUp(500, function(){
    $("#"+data.id).alert('close');
  });
};
