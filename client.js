var latency;
let MessageHandler;
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
	MessageHandler = new EventHandler();
	MessageHandler.addEventListener('accepted', function(e){
		console.log("Accepted event handler");
	});
	//function init(){
		var players = [];
		var playerTranslation = [[0,0],[0,0]]; 
		
		var mainSocket = new WebSocket(<SERVERIP>);

		mainSocket.onopen = function(opening)
		{
			players.push(new Player(document.getElementById('id').innerText, document.getElementById('username').innerText, document.getElementById('rank').innerText));
			//Need a new way of transferring player data to the server
			mainSocket.send(constructMsg("connection", players[0]));
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
			players = [];
		}
		
		mainSocket.onmessage = function(message)
		{
			if (isJSON(message.data)) 
			{
				data = JSON.parse(message.data)
				MessageHandler.dispatchEvent(data.messageType, data.contents);
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
				}
				else if (data.messageType == "move")
				{
					playerTranslation[1][0] = data.contents.newPosY;
					playerTranslation[1][1] = data.contents.newPosX;
				}
				else if (data.messageType == "chat")
				{
					if (data.contents.sender != players[0].getName())
					{
						document.getElementById('chat-log').value = document.getElementById('chat-log').value + "\r\n" + data.contents.sender + " says: " + data.contents.message;
					}
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
		
		document.getElementById('chat-box').addEventListener('keydown', function(e){
			if (e.key == "Enter")
			{
				var info = {
					sender: players[0].getName(),
					message: this.value
				};
				mainSocket.send(constructMsg("chat", info));
				if (document.getElementById('chat-log').value == "" || document.getElementById('chat-log').value == null)
				{
					document.getElementById('chat-log').value = info.sender + " says: " + info.message;
				}
				else 
				{
					document.getElementById('chat-log').value = document.getElementById('chat-log').value + "\r\n" + info.sender + " says: " + info.message;
				}
				this.value = "";
			}
		}, false);
	//}
	//init();
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
