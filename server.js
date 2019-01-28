const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({ port: <PORT> });


wss.on('connection', function connection(ws, req) {
console.log("Connection by: " + req.headers['x-forwarded-for']); 
console.log("Connection originating from: " + req.connection.remoteAddress);

if (req.connection.remoteAddress != "<SERVERIP>")
{
	ws.terminate();
}
else 
{
	var latency = Date.now();
	  
	  ws.on('pong', function(){
		  console.log('Ping');
	  });
	  
	  
	  ws.on('close', function closing(message)
	  {
		 console.log("Player disconnected");  
	  });
  
  
		ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		
		if (isJSON(message))
		{
			var data = JSON.parse(message);
			if (data.messageType == "heartbeat")
			{
				console.log("Ping: %s ms", Date.now() - latency);
				ws.send(constructMsg("heartbeat", "pong"));  
			}
			else if (data.messageType == "connection")
			{
				var sid = crypto.randomBytes(20).toString('hex');
				ws.send(constructMsg("accepted", sid));
				ws._sessionID = sid;
			}
			else if (data.messageType == "update")
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

