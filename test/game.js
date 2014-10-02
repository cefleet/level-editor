var game = new Phaser.Game(1200,800, Phaser.CANVAS,'', {
	create:create,
	preload:preload,
	update : update
});

var grid = {
		
		settings : {
			tilewidth : 64,
			tileheight : 64,
			tilesx : 12,
			tilesy : 10,
			startLoc : [30,30],
			color : {
				line : 0x2F2F2F,
				fill : 0x9C9C9c
			}
		},
		tiles : {}
};

function preload(){
	game.load.image('block','item.png');
	maketiles();
	makegrid();
}

function maketiles(){
	
	
	r = 0;	
	i = 0;
	while(r < grid.settings.tilesy){
		c = 0;
		while(c < grid.settings.tilesx){
			grid.tiles[c+'-'+r] = {
				x : c*grid.settings.tilewidth+grid.settings.startLoc[0],
				y : r*grid.settings.tileheight+grid.settings.startLoc[1],
				id : i
			}
			c++;
			i++;
		}
		r++;
	}
}

function makegrid(){
	var l = game.add.graphics(0, 0);  //init rect
	l.lineStyle(1, grid.settings.color.line, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
	l.beginFill(grid.settings.color.fill, 1);
		
	//l.drawRect(grid.settings.startLoc[0], grid.settings.startLoc[1], grid.settings.tilewidth*grid.settings.tilesx+grid.settings.startLoc[0], grid.settings.tileheight*grid.settings.tilesy+grid.settings.startLoc[1])
	
	r = 0;	
	c = 0;
	while(r <= grid.settings.tilesx){
		l.moveTo(grid.settings.startLoc[0]+(grid.settings.tilewidth*r), grid.settings.startLoc[1]); // x, y
		l.lineTo(grid.settings.startLoc[0]+(grid.settings.tilewidth*r), grid.settings.tileheight*(grid.settings.tilesy+1));
		r++;
	}
	while(c <= grid.settings.tilesy){
		l.moveTo(grid.settings.startLoc[0], grid.settings.startLoc[1]+(grid.settings.tileheight*c)); // x, y
		l.lineTo(grid.settings.tilewidth*(grid.settings.tilesx+1),grid.settings.startLoc[1]+(grid.settings.tileheight*c));
		c++;
	}
}

function create(){
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	game.stage.backgroundColor ='#F5EE00';
	grid.marker = game.add.sprite(30, 30,'block');
	
	game.input.mouse.mouseMoveCallback = function(c){
		grid.activeTile = null;
		for(var tile in grid.tiles){
			var t = grid.tiles[tile];
			if(c.x > t.x && c.x < t.x+grid.settings.tilewidth && c.y > t.y && c.y < t.y+grid.settings.tileheight){
				grid.marker.x = t.x;
				grid.marker.y = t.y;
				grid.activeTile = t;
				if(game.input.activePointer.isDown){
					if(t.sprite){
						t.sprite.destroy();
					}
					t.sprite = game.add.sprite(t.x,t.y,'block');
					//TODO add the code here too
				}
			}
		}
	}
	
	game.input.mouse.mouseDownCallback = function(c){
		console.log(c);
		if(grid.activeTile){
			var t = grid.activeTile;
			if(c.which === 1){				
				if(t.sprite){
					t.sprite.destroy();
				}
				t.sprite = game.add.sprite(t.x,t.y,'block');
			} else if(c.which === 3){
				if(t.sprite){
					t.sprite.destroy();
				}
			}
		}
	}
	

}

function testme(p,s){
	
	console.log(this);
}

function update(){
	
}
