var latency = Date.now();
var config = getJSON("config.json", function(data){
	config = JSON.parse(data);
});
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
	//var serverInfo = config.serverConfig;
	mainSocket = new WebSocket("ws://185.151.31.148:6001");
	
	mainSocket.onopen = function(opening)
	{
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
				console.log("Received a ping: %s ms.", (Date.now() - latency)/2); //(data.timestamp - latency));
				//checkStatus();
			}
			else if (data.messageType == "accepted")
			{
				//latency = data.timestamp - latency;
				//console.log("%s ms", latency);
				//userinfo.setSID(data.contents);
				console.log(data.contents);
				//console.log(userinfo);
			}
			else if (data.messageType == "info")
			{
				//console.log("ID: %s", data.contents);
			}
			else if (data.messageType == "move")
			{
				//document.getElementsByTagName('body')[0].dispatchEvent("onkeydown", {detail: data.contents});
				playerTranslation[1][0] = data.contents.newPosY;
				playerTranslation[1][1] = data.contents.newPosX;
			}
		}
	}
	
	function checkStatus()
	{
		console.log("Checking status");
		clearTimeout(timeout);
		
		
		timeout = setTimeout(function(){
			mainSocket.close();
			clearInterval(heartbeat);
		}, 30000);
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
