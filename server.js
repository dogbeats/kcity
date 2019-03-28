const WebSocket = require('ws');
const crypto = require('crypto');
const Game = require('game');
const PlayerHandler = require('PlayerHandler');
const CommandHandler = require('CommandHandler');
const _MessageHandler = require('MessageHandler');

const wss = new WebSocket.Server({ port: <PORT> });
const gameHandler = new Game();
const messageHandler = new _MessageHandler();
var latency;

console.log("Game state: %s", gameHandler.getState());

gameHandler.initialise();
//For reference, e.sender = ws

messageHandler.addEventListener('connection', function(e){
	console.log("Generating Player Session ID.");
	var sid = crypto.randomBytes(20).toString('hex');
	e.sender._playerIndex = gameHandler.getPlayerHandler().addPlayer(e.data._id, e.data._name, e.data._rank, sid);
	e.sender.send(constructMsg("accepted", sid));
	e.sender.sid = sid;
	console.log("Session ID generated and successfully attached.");
});

messageHandler.addEventListener('chat', function(e){
	console.log("Chat event fired");
	if (e.data.message[0] == ":" && e.data.message[1] == ":")
	{
		var cmd = e.data.message.split(" ")[0];
		commands = gameHandler.getCommandHandler();
		if (commands.isCommand(cmd))
		{
			console.log("is");
			cmd = commands.getCommandIndex(cmd);
			args = e.data.message.split(commands.getArgs(cmd))[1];
			if (gameHandler.getPlayerHandler().getPlayer(e.sender.sid).getRank() >= commands.getCommandRank(cmd))
			{
				commands.commit(cmd, args);
			}
			else 
			{
				sendAllButClient(e.sender, e.data.message);
			}
		}
		else 
		{
			sendAll(e.data.message);
		}
	}
	else 
	{
		sendAllButClient(e.sender, e.data.message);
	}
});

messageHandler.addEventListener('heartbeat', function(e)
{
	console.log("Heartbeat event fired");
	console.log("Ping: %s ms", Date.now() - latency);
	e.sender.send(constructMsg("heartbeat", "pong"));  
});

var origin = <SERVER IP>;

wss.on('connection', function connection(ws, req) {
//console.log("Connection by: " + req.headers['x-forwarded-for']); KEEP THIS
console.log("Connection originating from: " + req.connection.remoteAddress);

if (req.connection.remoteAddress != origin)
{
	console.log(req.connection.remoteAddress);
	ws.terminate();
}
else 
{
	});*/
	latency = Date.now();
	  
	  ws.on('pong', function(){
		  console.log('Ping');
	  });
	  
	  
	  ws.on('close', function closing(message)
	  {
		 console.log("Player disconnected");  
		 //players.clearPlayer(ws._playerIndex); 
	  });
  
  
		ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		
		if (isJSON(message))
		{
			latency = Date.now();
			var data = JSON.parse(message);
			var serverdata = 
			{
				data: data.contents,
				sender: ws
			}
			messageHandler.dispatchEvent(data.messageType, serverdata);
			if (data.messageType == "update")
			{
				wss.clients.forEach(function each(client)
				{
					if (client != ws)
					{
						client.send(constructMsg("move", data.contents));
					}
				});
			}
		}
	  });
	  
  }
});

function broadcastChat(message)
{
		wss.clients.forEach(function each(client)
			{
				client.send(constructMsg("chat", message));
			});
}

function sendAllButClient(sender, message)
{
	wss.clients.forEach(function each(client)
			{
				if (client != sender)
				{
					client.send(constructMsg("chat", message));
				}
			});
}

function sendAll(message)
{
	wss.clients.forEach(function each(client)
	{
		client.send(constructMsg("chat", message));
	});
}

function isJSON(data)
	{
		try {
			JSON.parse(data);
		} 
		catch (e){
			return false;
		}
		return true;
	}
	
function constructMsg(_msgType, _contents)
{
	latency = Date.now();
	if (Array.isArray(_contents))
	{
		JSON.stringify(_contents);
	}
	var message = {
		messageType: _msgType,
		timestamp: latency,
		contents: _contents
	}
	console.log(message);
	return JSON.stringify(message);
}

