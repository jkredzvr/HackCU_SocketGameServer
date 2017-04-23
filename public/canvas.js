var app = new PIXI.Application(700, 600, {backgroundColor : 0xbec5d1});
document.body.appendChild(app.view);
var container = new PIXI.Container();
app.stage.addChild(container);

var playerTexture = PIXI.Texture.fromImage('person.png');
var enemyTexture = PIXI.Texture.fromImage('enemyRed.png');
var bombTexture = PIXI.Texture.fromImage('bomb.png');
var explosionTextures = [], i;

var player;
var enemies = [];

createPlayer();
createBomb();
// Center on the screen
container.x = (app.renderer.width - container.width) / 2;
container.y = (app.renderer.height - container.height) / 2;

PIXI.loader
    .add('spritesheet', 'explosion.json')
    .load(onAssetsLoaded);

function createPlayer()
{
    player = new PIXI.Sprite(playerTexture);
    player.anchor.set(0.5);
    player.scale.x /= 2;
    player.scale.y /= 2;
    player.x = 300;
    player.y = 300;
    app.stage.addChild(player);
}

function createEnemy(x, y)
{
    console.log("Create an Enemy!");
    enemy = new PIXI.Sprite(enemyTexture);
    enemy.anchor.set(0.5);
    enemy.scale.x /= 2;
    enemy.scale.y /= 2;
    enemy.x = x;
    enemy.y = y;
    app.stage.addChild(enemy);
    enemies.push(enemy);
}

function createBomb(){
    var bombIcon = new PIXI.Sprite(bombTexture);
    bombIcon.alpha = .5;

    setTimeout(function(){
    bombIcon.alpha = 1;        
    bombIcon.interactive = true;
    bombIcon.buttonMode = true;
    }, 3000)

    bombIcon.anchor.set(0.5);
    bombIcon  
        .on('pointerdown', onBombDragStart)
        .on('pointerup', onBombDragEnd)
        .on('pointerupoutside', onBombDragEnd)
        .on('pointermove', onDragMove);
    bombIcon.x = 650;
    bombIcon.y = 100;
    app.stage.addChild(bombIcon);
}

function movePlayer(position){
    player.x = position.x;
    player.y = position.y;
}

function moveEnemy(data){
    if(data.id >= enemies.length)
    {
        createEnemy(data.x, data.y);
    }
    else
    {
        enemies[data.id].x = data.x;
        enemies[data.id].y = data.y;
    }
}

function removeEnemy(data)
{
    app.stage.removeChild(enemies[data.id]);
}

function onBombDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    createBomb();
}

function onBombDragEnd() {
    var bomb = this;
    this.alpha = 1;
    this.dragging = false;
  	this.interactive = false;
    this.scale.x /= 2;
    this.scale.y /= 2;
    setTimeout(function(){ 
        app.stage.removeChild(bomb); 
        explode(bomb.x, bomb.y);
    }, 3000);
    console.log(this.x + " " + this.y);
    socket.emit('NEW COORD', [this.x,this.y] );
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function onAssetsLoaded() {

    // create an array to store the textures


    for (i = 0; i < 26; i++) {
         var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i+1) + '.png');
         explosionTextures.push(texture);
    }
}

function explode(x, y){
    var explosion = new PIXI.extras.AnimatedSprite(explosionTextures);
    console.log(x + " " + y);
    explosion.x = x;
    explosion.y = y;
    explosion.scale.x /= 1.5;
    explosion.scale.y /= 1.5;
    explosion.anchor.set(0.5);
    explosion.rotation = Math.random() * Math.PI;
    //explosion.scale.set(0.75 + Math.random() * 0.5);
    app.stage.addChild(explosion);
    explosion.play();

    // start animating
    app.start();
  	setTimeout(function(){
      app.stage.removeChild(explosion);
    }, 400)
}

// var pos;
// var dragged;

// var prev_player_posX;
// var prev_player_posY;


// var canvas = document.getElementById('myCanvas'),
//     elemLeft = canvas.offsetLeft,
//     elemTop = canvas.offsetTop,
//     context = canvas.getContext('2d'),
//     elements = [];
//     coords = "";

// function allowDrop(ev) {
//     ev.preventDefault();
// }

// // function get_pos(ev){
// //     dragPos = [ev.pageX, ev.pageY];
// //     console.log(dragPos);
// // }

// function drag(ev) {
//     ev.dataTransfer.setData("Text",ev.target.id);
// }

// function movePlayer(position){
//     //Clear previoius pos
//     document.getElementById("myCanvas").getContext("2d").clearRect(prev_player_posX,prev_player_posY,32,32);

//     document.getElementById("myCanvas").getContext("2d").drawImage(document.getElementById("player"), position.x, position.y, 32, 32);
//     prev_player_posY = position.y;
//     prev_player_posX = position.x;
// }

// function drop(ev) {
//     var dropPos = [ev.pageX - elemLeft, ev.pageY - elemTop];
//     context.font='36px FontAwesome';
//     ev.preventDefault();
//     var offset = ev.dataTransfer.getData("text/plain").split(',');
//     var data=ev.dataTransfer.getData("Text");

//     var img = canvas = document.getElementById(data);
//     var dx = dropPos[0] - img.width / 2;
//     var dy = dropPos[1] - img.height / 2;

//     socket.emit('NEW COORD', [dropPos[0],dropPos[1]] );

//     document.getElementById("myCanvas").getContext("2d").drawImage(document.getElementById(data), dx, dy, 32, 32);
//     elements.push(dropPos);
//     // elements[elements.length - 1].width /= 2;
//     // elements[elements.length - 1].height /= 2;
//     console.log(dropPos[0] + " " + dropPos[1] + " " + elements.length);
// }
