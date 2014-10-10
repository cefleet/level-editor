var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});


//There may be some confusion because sometimes the first tile is 1 and sometimes it is 0
var tileset = {
	tilesetImage : 'tileset5.png',
	name : 'tiles',
	tilesetHeight : 265,
	tilesetWidth : 256,
	tilewidth : 32,
	tileheight : 32,
	tilesx : 16,
	tilesy : 18,
	collision : [
		0,1,[2,23]
	]
};

var grid = {	
		tiles : {},
		activeTileOp : 0,
		color : {
			line : 0x2F2F2F,
			fill : 0x9C9C9C
		},
		startLoc  : [30,60],
		settings : tileset
};

menu = {
  file : {}
};

function preload(){
  game.plugins.add(new Phaser.Plugin.LevelEditor(game));
	game.load.spritesheet(tileset.name,grid.settings.tilesetImage,grid.settings.tilewidth,grid.settings.tileheight);

};

function maketiles(){
	
	r = 0;	
	i = 0;
	while(r < grid.settings.tilesy){
		c = 0;
		while(c < grid.settings.tilesx){
			grid.tiles[i] = {
				x : c*grid.settings.tilewidth+grid.startLoc[0],
				y : r*grid.settings.tileheight+grid.startLoc[1],
				id : i,
				row : c,
				col : r,
				loc : c+'-'+r,
				tileId : 0
			}
			c++;
			i++;
		}
		r++;
	}
};

function makeMenuBar(){
		
	//this is awkward but it seems to work fine for now
	var m = game.add.graphics(0, 0);
	
	m.lineStyle(1, grid.color.line, 1); 
	m.beginFill(grid.color.fill, 1);	

	//title bar bg
	m.drawRect(0,0, window.innerWidth, 40);
	
	var fileButton = game.add.button(0,0,'',toggleFile,this);
	fileButton.width = 100;
	fileButton.height = 40;
	
	game.add.text(10,10, 'File', {
		font : '18px Arial',
		fill :'#2F2F2F'
	});
}

//Menu button class needed for real deal
function toggleFile(){

  if(!menu.file.open){
  
    menu.file.bg = game.add.graphics(0,0);
	  menu.file.bg.lineStyle(1, grid.color.line, 1); 
	  menu.file.bg.beginFill(grid.color.fill, 1);	
	  menu.file.bg.drawRect(0,40, 160, 120);
	  menu.file.bg.endFill();    
	  menu.file.open = true;  
	  
  } else {
  
    menu.file.bg.destroy();
    menu.file.open = false;
  
  }
}

function makegrid(){
	
	grid.gridImage = game.add.graphics(0, 0);  //init rect
	grid.gridImage.lineStyle(1, grid.color.line, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
	grid.gridImage.beginFill(grid.color.fill, 1);
	
	//grid bg
	grid.gridImage.drawRect(grid.startLoc[0],grid.startLoc[1], grid.settings.tilesx*grid.settings.tilewidth, grid.settings.tilesy*grid.settings.tileheight);
	
	r = 0;	
	c = 0;
	while(r <= grid.settings.tilesx){
		grid.gridImage.moveTo(grid.startLoc[0]+(grid.settings.tilewidth*r), grid.startLoc[1]); // x, y
		grid.gridImage.lineTo(grid.startLoc[0]+(grid.settings.tilewidth*r), grid.settings.tileheight*(grid.settings.tilesy)+grid.startLoc[1]);
		r++;
	}
	while(c <= grid.settings.tilesy){
		grid.gridImage.moveTo(grid.startLoc[0], grid.startLoc[1]+(grid.settings.tileheight*c)); // x, y
		grid.gridImage.lineTo(grid.settings.tilewidth*(grid.settings.tilesx+1),grid.startLoc[1]+(grid.settings.tileheight*c));
		c++;
	}
};

function makeSelectTiles(){
	game.selectionGroup = game.add.group();
	grid.tileOps = {}; 
	
	//this is awkward but it seems to work fine for now
	game.selectionGroup.graphic = game.selectionGroup.add(game.add.graphics(0, 0));
	
	game.selectionGroup.graphic.lineStyle(1, grid.color.line, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
	game.selectionGroup.graphic.beginFill(grid.color.fill, 1);
		
	var cols = tileset.tilesetHeight/tileset.tileheight;
	var rows = tileset.tilesetWidth/tileset.tilewidth;  
  
	var i = 0;
	var c = 0;
	var yo = 60;
	var xo = window.innerWidth - tileset.tilewidth*6;
	var y = yo;
	var x = xo;
	var yoff = 0;
	var xoff = tileset.tilewidth+6;
	
	//odd arbitary numbers here
	game.selectionGroup.graphic.drawRect(x-20,y-20, (tileset.tilewidth+6)*5, (tileset.tileheight+4)*17);
	
	while(c <= cols-1){
		r = 0;
		while(r <= rows-1){
			if(yoff >=16){
				yoff = 0;
				x += xoff;
			}
			y = tileset.tileheight*(yoff+1)+yoff*2+yo;
			grid.tileOps[i] = game.add.button(x, y, tileset.name, selectTile, this);
			grid.tileOps[i].id = i;
			grid.tileOps[i].frame = i;
			game.selectionGroup.add(grid.tileOps[i]);
			yoff++;
			r++;
			i++;
		}
		c++;
	}
};

function create(){
	//maketiles();
//	makegrid();
  game.le.create('My Level', {loc : [300,100]});
	makeSelectTiles();
	makeMenuBar();
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	game.stage.backgroundColor ='#3F5465';
	grid.marker = game.add.sprite(0,0,'');
	
	game.input.mouse.mouseMoveCallback = function(c){
		grid.activeTile = null;
		for(var tile in grid.tiles){
			var t = grid.tiles[tile];
			if(c.x > t.x && c.x < t.x+grid.settings.tilewidth && c.y > t.y && c.y < t.y+grid.settings.tileheight){
				grid.marker.x = t.x;
				grid.marker.y = t.y;
				grid.activeTile = t;
				if(game.input.activePointer.isDown){
				  if(!menu.file.open){
					if(t.sprite){
						t.sprite.destroy();
						t.tileId = 0;
					}
				  t.sprite = game.add.sprite(t.x,t.y,'tiles',grid.activeTileOp*1);
				  t.tileId = grid.activeTileOp*1+1;
				  }
				}
			}
		}
	}
	
	game.input.mouse.mouseDownCallback = function(c){
	  if(!menu.file.open){
		if(grid.activeTile){
			var t = grid.activeTile;
			if(c.which === 1){				
				if(t.sprite){
					t.sprite.destroy();
				}
				t.sprite = game.add.sprite(t.x,t.y,'tiles',grid.activeTileOp*1);
				t.tileId = grid.activeTileOp*1+1;
			} else if(c.which === 3){
				if(t.sprite){
					t.sprite.destroy();
					t.tileId = 0;
				}
			}
		}
		}
	}
	
};

function selectTile(item){
	grid.activeTileOp = item.id;
	grid.marker.destroy();
	grid.marker = game.add.sprite(0,0,'tiles',item.id*1);
};

function load(data){
	//this is the data only
	for(var i = 0; i < data.length; i++){
		var id = data[i];
		var t = grid.tiles[i];
		t.tileId = id;
		t.sprite = game.add.sprite(t.x,t.y,'tiles',id-1);
		
	}
};

function save(){
	var ar = [];
	for(var t in grid.tiles){
		ar.push(grid.tiles[t].tileId);
	}
	var json = {
		height : tileset.tilesy,
		width: tileset.tilesx,
		layers  : [
			{
				data : ar,
				height : tileset.tilesy,
				name : 'layer',
				opacity : 1,
				type : 'tilelayer',
				visible : true,
				width: tileset.tilesx,
				x : 0,
				y: 0
			}
		],
		tilesets : [
			{
				firstgid : 1,
				image : tileset.tilesetImage,
				imageheight : tileset.tilesetHeight,
				imagewidth : tileset.tilesetWidth,
				margin : 0,
				name : tileset.name,
				spacing : 0,
				tileheight: tileset.tileheight,
				tilewidth : tileset.tilewidth
				
			}
		],
		orientation:"orthogonal",
		tileheight : tileset.tileheight,
		tilewidth:tileset.tilewidth,
		version :1		
	}
	return json;
};

function update(){
	
}
