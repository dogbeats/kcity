function GetObjectVertices(objectId){
	var positions = [
		-1.0, 0.0,  1.0,
		0.0,  -0.5,  1.0,
		1.0,  0.0,  1.0,
		0.0,  0.5,  1.0
	];
	return positions;
}

function GetObjectIndices(objectId){
	var indices = [
		0,  1,  2,      0,  2,  3    // front
		//4,  5,  6,      4,  6,  7,    // back
		//8,  9,  10,     8,  10, 11,   // top
		//12, 13, 14,     12, 14, 15,   // bottom
		//16, 17, 18,     16, 18, 19,   // right
		//20, 21, 22,     20, 22, 23,   // left
	];
	return indices;
}

function GetObjectTexture(objectId){
	return 'textures/tex_floor_basic.png';
}

function GetObjectTextureCoordinates(objectId){
	var textureCoordinates = [
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0
	];
	return textureCoordinates;
}