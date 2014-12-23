Intercom = function(options){
  options = options || {};
  this.EventEmitter = options.EventEmitter || new EventEmitter();
  this.eventsTable = {};
  return this;

};

Intercom.prototype = {
/*
  This setups the listeners. It expects the trigger to send an array of
  the arguments for the function that it will be preforming.

  the dynamic evernt removal was found:
  https://www.andrewzammit.com/blog/node-js-dynamic-event-listener-binding-and-removal/
  */
  setupListeners : function($this){

    for(var l in $this.listenOutFor){
      var e = $this.listenOutFor[l];
      if(typeof $this[e.action] === 'function'){
        if(e.once) {
          this.EventEmitter.once(e.event,$this[e.action].bind($this));
        } else {
          var f = $this[e.action].bind($this);
          if(!this.eventsTable[e.event]){
            this.eventsTable[e.event] = {};
          }
          this.eventsTable[e.event][e.action] = f;
          this.EventEmitter.on(e.event,f);
        }
      } else {
        console.warn('The function '+e.action+' is not found. The event '+
        e.event+' will do nothing to this Object.');
      }
    }
  },
  stopListening : function($this){
    for(var l in $this.listenOutFor){
      var e = $this.listenOutFor[l];
      if(typeof $this[e.action] === 'function'){

        this.EventEmitter.off(e.event, this.eventsTable[e.event][e.action]);
      }
    }
  }
};

Intercom.prototype.constructor = Intercom;
