var object = [];/*[{
	vertexCoordinates: [],
	vertexIndices: [],
	textureCoordinates: [],
	objectPosition: [],
	texture: ''
}]*/

/*
var tempObject1 = '{
	"id":1,
	"vertexCoordinates":[
			-1.0, 1.0,  0.0,
			-1.0,  -1.0,0.0,
			1.0,  -1.0, 0.0,
			1.0,  1.0,  0.0
	],
	"vertexIndices": [
			0,  1,  2,      
			0,  2,  3  
	],	
	"vertexNormals": [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	],
	"textureCoordinates":[
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0
	],
	"textureLocation":"textures/tex_floor_basic.png",
	"isTile":true,
	"isPhysical":true
}';
*/

var tempObject1 = '{"id":1,"vertexCoordinates":[-1.0, 1.0,0.0,-1.0,-1.0,0.0,1.0,-1.0,0.0,1.0,1.0,0.0],"vertexIndices":[0,1,2,0,2,3],"vertexNormals":[0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0],"textureCoordinates":[0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0],"textureLocation":"textures/tex_floor_basic.png","isTile":true,"isPhysical":true}';

/*
var levelObjects = '{
	{
		"objectId":1,
		"objectPosition":[2,2,-6],
		"objectRotation":[0.0,0.0,0.0],
		"objectScale":1,
		"playerControl":false
	}
}';
*/
/*
var levelObjects = JSON.parse( '{"objects":{"1":{"objectId":1,"objectPosition":[2,2,-6],"objectRotation":[0.0,0.0,0.0],"objectScale":1,"playerControl":false}}}');
*/

var levelObjects = JSON.parse( '{"objects":{"1":{"objectId":1,"objectPosition":[2,2,-5],"objectRotation":[0.0,0.0,0.0],"objectScale":1,"playerControl":false},"2":{"objectId":1,"objectPosition":[0,0,-5],"objectRotation":[0.0,0.0,0.0],"objectScale":1, "playerControl":false},"3":{"objectId":3,"objectPosition":[0,5,-5],"objectRotation":[0.0,0.0,0.0],"objectScale":1, "playerControl":false},"4":{"objectId":1,"objectPosition":[2,0,-5],"objectRotation":[0.0,0.0,0.0],"objectScale":1, "playerControl":false}}}');


//"3":{"objectId":2,"objectPosition":[0,0,-3],"objectRotation":[0.0,0.0,0.0],"objectScale":1, "playerControl":true}}}');