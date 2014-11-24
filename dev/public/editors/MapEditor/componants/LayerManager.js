MapEditor.LayerManager  = function(options,parent){
  options = options  || {};
  //This is gleaned from th egrid
  this.tilewidth = options.tilewidth || 32;
  this.tileheight = options.tileheight || 32;
  this.tilesy = options.tilesy || 16;
  this.tilesx = options.tilesx || 18;
  this.loc = options.loc || [0,0];

  this.parent = parent;
  this.EventEmitter = this.parent.EventEmitter;
  this.layers = {};

  this.listenOutFor = [
  {
    event : 'createLayer',
    action :'create'
  }
  ];

  this.parent.Intercom.setupListeners(this);
  return this;
};

MapEditor.LayerManager.prototype = {

  create : function(name,id){
    var highest = 0;
    for(var layer in this.layers){
      if(this.layers[layer].order > highest) {
        highest = this.layers[layer].order+1;
      }
    }

    var options = {
      name : name,
      id : id,
      order : highest
    };

    var t = new MapEditor.Layer(options, this);
    this.layers[t.id] = t;
  //  console.log(t);

    this.EventEmitter.trigger('layerCreated', [t]);
    this.makeLayerActive(t);
  },

  loadLayers : function(map){
    this.layers = {};// this effictivly deletes the "base" layer that was added on create. There would not be anything in it so it shouldn't hurt anything
    var len = map.tilemap.layers.length;
    var layers = map.tilemap.layers;
    for(var j = 0; j < len; j++){
      this.loadLayer(layers[j], map.layers[layers[j].name]);
    }
    //set the order
    var tempArr = [];
    for(var l in this.layers){
      tempArr.push([l,this.layers[l].order]);
    }
    tempArr.sort(function(a,b){return a[1]-b[1];});

    var orderArr = [];

    for(var i = 0; i < tempArr.length; i++){
      orderArr.push(tempArr[0]);
    }

    this.orderLayers(orderArr);
    //then get
    this.makeLayerActive(layers[0].name);
  },

  loadLayer : function(layer, layerinfo){
    this.createLayer(layerinfo.name,layerinfo.id);
    this.layers[layerinfo.id].order = layerinfo.order;
    var data = layer.data;
    for(var i = 0; i < data.length; i++){
      var id = data[i];
      var t = this.layers[layer.name].tiles[i];
      t.tilesetId = id;
      if(id !== 0){
        //frame starts with 0 first item
        /*******
        * WRONG DO NOT CALL LE FROM INSIDE
        */
        if(GameMaker.LE.tileset.tiles[id-1]){
          t.sprite = this.game.add.sprite(t.x,t.y,GameMaker.LE.tileset.name, GameMaker.LE.tileset.tiles[id-1].frame);
          this.layers[layerinfo.id].add(t.sprite);
        }
      }
    }
  },

  //make layer active
  makeLayerActive : function(layer){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }
    this.activeLayer = layer;
    console.log(layer);
    this.EventEmitter.trigger('activeLayerSet',[layer]);
  },

  //Show Hid layer
  toggleLayer : function(layer){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }

    if(layer.visible){
      layer.visible = false;
    } else {
      layer.visible = true;
    }
  },

  renameLayer : function(layer, newName){
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }

    layer.name = newName;
  },

  //orders the layers by id or actall object. order is an array
  orderLayers : function(order){
    var o = order.length;
    for(var i =0; i < order.length; i++){
      var layer = order[i];
      if(typeof  layer === 'string'){
        layer = this.layers[layer];
      }
      if(typeof layer !== 'undefined'){
        layer.order = o;
        this.layersGroup.sendToBack(layer);
        o--;
      }
    }
  },

  deleteLayer : function(layer){
    console.log(layer);
    if(typeof layer === 'string'){
      layer = this.layers[layer];
    }
    console.log(layer);
    this.layersGroup.remove(layer,true);
  },
  /*
  * Makes the tiles (id and location data) into an array
  * */
  makeTiles : function(layer){
    var r = 0;
    var i = 0;
    while(r < this.tilesy){
      var c = 0;
      while(c < this.tilesx){
        layer.tiles[i] = {
          x : c*this.tilewidth+this.loc[0],
          y : r*this.tileheight+this.loc[1],
          id : i,
          row : c,
          col : r,
          loc : c+'-'+r,
          tilesetId : 0
        };
        c++;
        i++;
      }
      r++;
    }
  }

};

MapEditor.LayerManager.prototype.constructor = MapEditor.LayerManager;
