var latency;
var mainSocket;
var playerTranslation = [[0,0],[0,0]]; 
function getJSON(path, ret)
{ 
  var file = new XMLHttpRequest();
  file.overrideMimeType("application/json");
  file.open('GET', path, true);
  file.onreadystatechange = function () {
	if (file.readyState === 4 && file.status == "200") {
	  ret(file.responseText);
	}
	
  };
  file.send(null); 
}

window.onload = function()
{
	mainSocket = new WebSocket("<SERVER_LOCATION>");
	mainSocket.onopen = function(opening)
	{
		mainSocket.send(constructMsg("heartbeat", "ping"));
	}
	
	mainSocket.onclose = function(closing)
	{
		if (closing.code == 1006)
		{
			console.log("Server unavailable");
		}
		else 
		{
			console.log('Connection lost');
		}
	}
	
	mainSocket.onmessage = function(message)
	{
		if (isJSON(message.data)) //Generic statement, however will helped to identify position parameters - eventually JSON data will include request/message type.
		{
			data = JSON.parse(message.data)
			console.log(data);
			if (data.messageType == "heartbeat")
			{
				console.log("Received a ping: %s ms.", (Date.now() - latency)/2);
			}
			else if (data.messageType == "accepted")
			{
				console.log(data.contents);
			}
			else if (data.messageType == "info")
			{
				//Will be used to retrieve user info.
			}
			else if (data.messageType == "move")
			{
				playerTranslation[1][0] = data.contents.newPosY;
				playerTranslation[1][1] = data.contents.newPosX;
			}
		}
	}
}

function isJSON(data) {
	try { 
		JSON.parse(data); 
	} 
	catch (e){
		return false;
	}
	return true;
}

function constructMsg(_msgType, _contents) {
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
