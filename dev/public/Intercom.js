Intercom = function(options){
  options = options || {};
  this.EventEmitter = options.EventEmitter || new EventEmitter();
  return this;

};

Intercom.prototype = {
/*
  This setups the listeners. It expects the trigger to send an array of
  the arguments for the function that it will be preforming.
  */
  setupListeners : function($this){
    /*
    DONT DELETE YET I MAY END UP USING THIS
    var f = function(arr){
    //apply is the key thing here
    this.$this[this.e.action].apply(this.$this, arr);
  };

  for(var l in this.listenOutFor){
  var e = this.listenOutFor[l];
  var o = {$this: this,e : e};
  this.EventEmitter.on(e.event, f.bind(o));
}*/
    for(var l in $this.listenOutFor){
      var e = $this.listenOutFor[l];
      if(typeof $this[e.action] === 'function'){
        this.EventEmitter.on(e.event,$this[e.action].bind($this));
      } else {
        console.warn('The function '+e.action+' is not found. The event '+
        e.event+' will do nothing to this Object.');
      }
    }
  }
};

Intercom.prototype.constructor = Intercom;
