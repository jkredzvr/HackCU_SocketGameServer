var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


const uuidV4 = require('uuid/v4');

//var coordinates = require('/public/canvas.js');

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/", function(req,res){
	res.render("canvas");
});


//Client Arrays
var clients = [];
var webclients =[];

var NEWCOORD; 


//socket is the connected client 
io.on("connection", function(socket){
	
	var currentUser;



	//Send connected user info to socket client
	socket.on("USER_CONNECT", function(){
		console.log('user connected');
		for(var i = 0; i < clients; i++ ){
			socket.emit("USER_CONNECTED", { name:clients[i].name, position:clients[i].position } );
			console.log("User name "+clients[i].name+"is connected");
		}

	});

	//1.  Add socket client to clients array
	//2.  Emit back to client "PLAY" event with its own information
	//3.  Broadcast to all USER_CONNECTED event
	socket.on("PLAY", function(data){
		console.log(data);
		currentUser = {
			name:"UNITYCLIENT_"+uuidV4(),
			position:data.position
		}

		clients.push(currentUser);
		console.log(currentUser.name);
		socket.emit("PLAY", currentUser)

		//Broadcast to all
		socket.broadcast.emit("USER_CONNECTED", currentUser)
	});



	//CONNECTION FROM WEBSITE
	socket.on("WEBCLIENT_CONNECT", function(data){
		
		currentUser = {
			name:"WEBCLIENT_"+uuidV4(),
		}
		webclients.push(currentUser);

		console.log(currentUser.name);

		//Broadcast to all
		console.log("Web user connected: " + currentUser.name);
		socket.broadcast.emit("USER_CONNECTED", currentUser)
	});




	//New Coord Update FROM webclient, and broadcast to all
	socket.on("NEW COORD", function(newCoord){
		var NEWCOORD2;
		NEWCOORD2 = newCoord;

		NEWCOORD2 = {
			coordval:newCoord
		}
		console.log(NEWCOORD2)

		socket.broadcast.emit("boop");
		socket.broadcast.emit("GET_NEW_COORD", NEWCOORD2)
	});

	//1.  when client sends MOVE event
	//2.  emit back to client MOVE event
	//3.  broad to all 
	socket.on("MOVE", function(data){
		currentUser.position = data.position,
		socket.emit("MOVE", currentUser)
		console.log(currentUser.name+"move to "+currentUser.position)
		//Broadcast to all
		socket.broadcast.emit("MOVE", currentUser)
	});

	socket.on("PLAYER_POS", function(data){

		var playerPos =
		{
			x:data.posx,
			y:data.posy
		}
		//console.log(currentUser.name+"move to "+currentUser.position)
		//Broadcast to all
		socket.broadcast.emit("WEB_UPDATE_PLAYER", playerPos);
	});

	socket.on("ENEMY_POS", function(data){

		var enemyData =
		{
			x:data.posx,
			y:data.posy,
			id:data.id
		}
		//console.log(currentUser.name+"move to "+currentUser.position)
		//Broadcast to all
		socket.broadcast.emit("WEB_UPDATE_ENEMY", enemyData);
	});

	socket.on("ENEMY_DEAD", function(data){

		var enemyData =
		{
			id:data.id
		}
		//console.log(currentUser.name+"move to "+currentUser.position)
		//Broadcast to all
		socket.broadcast.emit("WEB_UPDATE_ENEMY_DEAD", enemyData);
	});


	socket.on("disconnect", function(){
		socket.broadcast.emit("USER_DISCONNECTED", currentUser)
		for (var i=0; i < clients.length; i++ ){
			if(clients[i].name == currentUser.name){
				console.log("User "+clients[i].name+" disconnected");
				clients.splice(i,1);
			}
		}
		for (var i=0; i < webclients.length; i++ ){
			if(webclients[i].name == currentUser.name){
				console.log("WebClient "+webclients[i].name+" disconnected");
				webclients.splice(i,1);
			}
		}
	});
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function(){
	console.log("-----SERVER IS RUNNING-------	")
});

