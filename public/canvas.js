var pos;
var dragged;

var prev_player_posX;
var prev_player_posY;


var canvas = document.getElementById('myCanvas'),
    elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop,
    context = canvas.getContext('2d'),
    elements = [];
    coords = "";

function allowDrop(ev) {
    ev.preventDefault();
}

// function get_pos(ev){
//     dragPos = [ev.pageX, ev.pageY];
//     console.log(dragPos);
// }

function drag(ev) {
    ev.dataTransfer.setData("Text",ev.target.id);
}

function movePlayer(position){
    //Clear previoius pos
    document.getElementById("myCanvas").getContext("2d").clearRect(prev_player_posX,prev_player_posY,32,32);

    document.getElementById("myCanvas").getContext("2d").drawImage(document.getElementById("player"), position.x, position.y, 32, 32);
    prev_player_posY = position.y;
    prev_player_posX = position.x;
}

function drop(ev) {
    var dropPos = [ev.pageX - elemLeft, ev.pageY - elemTop];
    context.font='36px FontAwesome';
    ev.preventDefault();
    var offset = ev.dataTransfer.getData("text/plain").split(',');
    var data=ev.dataTransfer.getData("Text");

    var img = canvas = document.getElementById(data);
    var dx = dropPos[0] - img.width / 2;
    var dy = dropPos[1] - img.height / 2;

    socket.emit('NEW COORD', [dropPos[0],dropPos[1]] );

    document.getElementById("myCanvas").getContext("2d").drawImage(document.getElementById(data), dx, dy, 32, 32);
    elements.push(dropPos);
    // elements[elements.length - 1].width /= 2;
    // elements[elements.length - 1].height /= 2;
    console.log(dropPos[0] + " " + dropPos[1] + " " + elements.length);
}
