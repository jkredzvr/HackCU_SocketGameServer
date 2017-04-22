var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//var coordinates = require('/public/canvas.js');

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/", function(req,res){
	res.render("canvas");
});

//app.listen(4000, 'localhost', function()
//{
//	console.log("Server is listening");
//});


//Client Array
var clients = [];

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
			name:data.name,
			position:data.position
		}

		clients.push(currentUser);
		socket.emit("PLAY", currentUser)

		//Broadcast to all
		socket.broadcast.emit("USER_CONNECTED", currentUser)
	});

	//CONNECTION FROM WEBSITE
	socket.on("WEB_CONNECT", function(data){
		console.log(data);
	});

	//CONNECTION FROM WEBSITE
	socket.on("COORD", function(data){
		console.log(data);
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

	socket.on("disconnect", function(){
		socket.broadcast.emit("USER_DISCONNECTED", currentUser)
		for (var i=0; i < clients.length; i++ ){
			if(clients[i].name == currentUser.name){
				console.log("User "+clients[i].name+" disconnected");
				clients.splice(i,1);
			}
		}
	});
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function(){
	console.log("-----SERVER IS RUNNING-------	")
});

