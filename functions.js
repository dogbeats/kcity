function GetObjectVertices(objectId){
	/*var positions = [
		-1.0, 0.0,  1.0,
		0.0,  -0.5,  1.0,
		1.0,  0.0,  1.0,
		0.0,  0.5,  1.0
	];*/
	if(objectId==0){
		var positions = [
			-1.0, 1.0,  0.0,
			-1.0,  -1.0,0.0,
			1.0,  -1.0, 0.0,
			1.0,  1.0,  0.0
		];
	} else {
		var positions = [
			-0.84, 0.33,  0.0,
			-0.84,  -0.33,  0.0,
			0.84,  -0.33,  0.0,
			0.84,  0.33,  0.0
		];
	}
	return positions;
}

function RequestObjectDetails(id){
	switch(id){
		case 1:
			return '{"id":1,"vertexCoordinates":[-1.0, 1.0,0.0,-1.0,-1.0,0.0,1.0,-1.0,0.0,1.0,1.0,0.0],"vertexIndices":[0,1,2,0,2,3],"vertexNormals":[0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0],"textureCoordinates":[0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0],"textureLocation":"textures/tex_floor_basic.png","isTile":true,"isPhysical":true}';	
			break;
		case 2:
			return '{"id":2,"vertexCoordinates":[-0.84,0.33,0.0,-0.84,-0.33,0.0,0.84,-0.33,0.0,0.84,0.33,0.0],"vertexIndices":[0,1,2,0,2,3],"vertexNormals":[0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0],"textureCoordinates":[0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0],"textureLocation":"textures/test_avatar_2.png","isTile":false,"isPhysical":false}';	
			break;
		case 3:
			return '{"id":2,"vertexCoordinates":[-2.0, 2.0,0.0,-2.0,-2.0,0.0,2.0,-2.0,0.0,2.0,2.0,0.0],"vertexIndices":[0,1,2,0,2,3],"vertexNormals":[0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0],"textureCoordinates":[0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0],"textureLocation":"textures/tex_floor_basic.png","isTile":true,"isPhysical":true}';	
			break;
		default: return false;
	}
}

function GetRotatedVertices(vertices, rotation){
	//I currently know there are 4 sets of vertices, so this is currently hard coded in. This needs to be changed in future
	var rotatedVertices = []
	for(var i = 0; i < 4; i++){
		var vec = [vertices[3*i],vertices[3*i+1],vertices[3*i+2]];
		vec3.rotateX(vec, vec, [0,0,0], rotation[0]);
		vec3.rotateY(vec, vec, [0,0,0], rotation[1]);
		vec3.rotateZ(vec, vec, [0,0,0], rotation[2]);
		rotatedVertices.push(vec[0]);
		rotatedVertices.push(vec[1]);
		rotatedVertices.push(vec[2]);
	}
	console.log(vertices);
	console.log(rotatedVertices);
	return rotatedVertices;
}

function GetObjectNormal(objectId){
	var normal = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];	
	return normal;
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
	switch(objectId){
		case 0:
			return 'textures/tex_floor_basic.png';
		case 1:
			return 'textures/test_avatar_2.png';
		default:
			return 'textures/tex_floor_basic.png'; //make this an error texture
	}
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

// https://nickthecoder.wordpress.com/2013/01/17/unproject-vec3-in-gl-matrix-library/
function unproject(vec, view, proj, viewport) { 
	var dest = vec3.create();//output
	var m = mat4.create();//view * proj
	var im = mat4.create();//inverse view proj
	var v = vec4.create();//vector
	var tv = vec4.create();//transformed vector
	 
	v[0] = vec[0]; 
	v[1] = vec[1]; 
	v[2] = vec[2]; 
	v[3] = 1.0;
	 
	//apply viewport transform
	//v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
	//v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
	//v[2] = vec[2];
	//v[3] = 1.0;
	 
	//build and invert viewproj matrix
	mat4.multiply(m,view,proj);
	if(!mat4.invert(im,m)) { return null; }
	 
	vec4.transformMat4(tv,v,im);
	if(v[3] === 0.0) { return null; }
	 
	dest[0] = tv[0] / tv[3];
	dest[1] = tv[1] / tv[3];
	dest[2] = tv[2] / tv[3];
	 
	return dest;
};

function unproject2(vec, view, proj, viewport) { 
	var dest = vec3.create();//output
	var m = mat4.create();//view * proj
	var ip = mat4.create();//inverse proj
	var iv = mat4.create();//inverse view
	var v = vec4.create();//vector
	var tv = vec4.create();//transformed vector
	
	var eye = vec4.create();
	
	v[0] = vec[0]; 
	v[1] = vec[1]; 
	v[2] = -1.0; 
	v[3] = 1.0;
	 
	if(!mat4.invert(ip,proj)) { return null; }
	vec4.transformMat4(eye,v,ip);
	
	if(!mat4.invert(iv,view)) { return null; }	
	vec4.transformMat4(tv,eye,iv);
	
	dest[0] = tv[0] / tv[3];
	dest[1] = tv[1] / tv[3];
	dest[2] = tv[2] / tv[3];
	return dest;
};

function ObjectTriRayIntersection(rayOrigin, rayLength, vertex1, vertex2, vertex3){
	const epsilon = 0.0000001;
	
	var rayVector = [0,0,rayLength];
	
	var edge1 = vertex2 - vertex1;
	var edge2 = vertex3 - vertex1;
	var h, a, f, s, u, q, v, t, temp;
	vec3.cross(h, rayVector, edge2);
	vec3.dot(a, edge1, h);
	if(a > - epsilon && a < epsilon)
		return false;
	f = 1.0/a;
	s = rayOrigin - vertex1;
	vec3.dot(temp,s,h);
	u = f * temp;
	if (u < 0.0 || u > 1.0)
        return false;
	vec3.cross(q, s, edge1);
	vec3.dot(temp, rayVector, q);
	v = f * temp;
	if (v < 0.0 || u + v > 1.0)
        return false;
	vec3.dot(temp, edge2, q);
	t = f * temp;
	if(t > epsilon){
		return rayOrigin + rayVector * t;
	} else {
		return null;
	}
}

function ObjectRayIntersectionTest(){
	var planeX = -0.7;
	var planeY = 4;
	var planeZ = 0.4;
	var planeC = 6.6;
	
	var point = [2.5,3,-2];
	var dir = [-3.7,2.8,2];
	
	var dot1 = planeX * dir[0] + planeY * dir[1] + planeZ * dir[2]; //5
	var dot2 = planeX * point[0] + planeY * point[1] + planeZ * point[2]; //7 
	
	var t = -(dot2 + planeC) / dot1; // -2.4
	
	document.getElementById("dot1").innerHTML = dot1;
	document.getElementById("dot2").innerHTML = dot2;
	document.getElementById("collisionX").innerHTML = (point[0] + dir[0] * t);
	document.getElementById("collisionY").innerHTML = (point[1] + dir[1] * t);
	document.getElementById("collisionZ").innerHTML = (point[2] + dir[2] * t);
}

function ObjectRayIntersection(p, q, r, point, objectPosition, rayLength){
	/*At some point this may be expanded to include other directions of intersection. Right now this assumes all force is downward only (z axis)*/
	/*Temp vars - to be implemented dynamically*/
	var lineDirection = [0,0,rayLength];
	document.getElementById("tempDetails").innerHTML = p[0] + ' ' + (p[0] + objectPosition[0]);
	p[0] -= objectPosition[0];
	p[1] -= objectPosition[1];
	p[2] -= objectPosition[2];	
	q[0] -= objectPosition[0];
	q[1] -= objectPosition[1];
	q[2] -= objectPosition[2];	
	r[0] -= objectPosition[0];
	r[1] -= objectPosition[1];
	r[2] -= objectPosition[2];
	/*Equation of the plane/normal - this should be precalculated in future*/
	var pq = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
	var pr = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
	var iVec = pq[1]*pr[2] - pq[2]*pr[1];
	var jVec = pq[0]*pr[2] - pq[2]*pr[0];
	var kVec = pq[1]*pr[0] - pq[0]*pr[1];
	var x = iVec ;//+ objectPosition[0];       // Basically Redundant
	var y = jVec ;//+ objectPosition[1];       // Basically Redundant
	var z = kVec ;//+ objectPosition[2];       // Basically Redundant
	var d = (iVec * p[0]) -(jVec * p[1]) + (kVec * p[2]);
	
	var dot1 = x * lineDirection[0] + y * lineDirection[1] + z * lineDirection[2];
	var dot2 = x * point[0] + y * point[1] + z * point[2];
	
	if(dot1 == 0) {
		document.getElementById("collisionBool").innerHTML = 'No dot1';
		return false;
	}
	
	document.getElementById("dot1").innerHTML = dot1;
	document.getElementById("dot2").innerHTML = dot2;
	
	document.getElementById("objX").innerHTML = objectPosition[0].toFixed(2);
	document.getElementById("objY").innerHTML = objectPosition[1].toFixed(2);
	document.getElementById("objZ").innerHTML = objectPosition[2].toFixed(2);
	document.getElementById("objC").innerHTML = d.toFixed(2);
	//document.getElementById("tempDetails").innerHTML = point[0] + "," + point[1] + "," + point[2] + " : " + lineDirection[0] + "," + lineDirection[1] + "," + lineDirection[2];
	
	var t = -(dot2 + d) / dot1;
	var newCoord = [(point[0] + lineDirection[0] * t), (point[1] + lineDirection[1] * t), (point[2] + lineDirection[2] * t)];
	//currentPlayerDirection = [iVec, jVec, kVec, d];
	currentPlaneEquation = [iVec, jVec, kVec, d, t]
	document.getElementById("collisionT").innerHTML = "dot2 + d = " + (dot2 + d) + " t: " + t;
	document.getElementById("collisionX").innerHTML = newCoord[0];
	document.getElementById("collisionY").innerHTML = newCoord[1];
	document.getElementById("collisionZ").innerHTML = newCoord[2];
	document.getElementById("collisionBool").innerHTML = 'Dot2';
	
	return newCoord;
}

function IsPointInPlane(p, q, r, point, objectPosition){
	var pq = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
	var pr = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
	var iVec = pq[1]*pr[2] - pq[2]*pr[1];
	var jVec = pq[0]*pr[2] - pq[2]*pr[0];
	var kVec = pq[1]*pr[0] - pq[0]*pr[1];
	var d = (iVec * p[0]) -(jVec * p[1]) + (kVec * p[2]);
	//console.log(iVec * point[0] + jVec * point[1] + kVec * point[2] - d);
	//console.log((iVec + objectPosition[0]) + 'x + ' + (jVec + objectPosition[1]) + 'y + ' + (kVec + objectPosition[2]) + 'z = ' + d);
	//console.log(iVec);
	//console.log(iVec * p[0]);
	//console.log(jVec * p[1]);
	//console.log(kVec * p[2]);
	//console.log((iVec) + 'x - ' + (jVec) + 'y + ' + (kVec) + 'z = ' + d);
	//console.log(point[2]);
	//console.log('1 : ' + point[2]);
	//console.log((iVec + objectPosition[0]) * point[0] + (iVec + objectPosition[1]) * point[1] - d);
	//return (iVec + objectPosition[0]) * point[0] + (iVec + objectPosition[1]) * point[1] - d;
	//var calc = (d - ((iVec + objectPosition[0]) * point[0]) + ((jVec + objectPosition[1]) * point[1])) / kVec;
	//console.log(playerTranslation[0][2] + ' ' + calc);

	//console.log(point);
}

function LinePlaneIntersection(){
	//to do
}

function EquationOfLine2D(a, b){	
	var slope = (b[1] - a[1]) / (b[0] - a[0]);
	if(b[0] == a[0])
		slope = b[0];
	var c = a[1] - (slope * a[0]);
	
	return [slope, c];
}

function EquationOfLine3D(a, b, c){
	return false;
}

function PointSideOfLine(a, b, point){ //Only supports 2D at the moment
	var line = EquationOfLine2D(a, b);
	var value = point[1] - line[0]*point[0] - line[1];
	if(value < 0)
		return "below";
	else if(value > 0)
		return "above";
	else 
		return false;
}

function CanObjectMove(position, input){
	/*At the moment, this is built only around player position/input. The aim is to expand this to any object*/
	var newPosition = [position[0] + input[0],position[1] + input[1],position[2] + input[2]];
	var lowestDistance, closestObject;
	var totalObjectCount = object.length;
	for(var i = 0; i < totalObjectCount; i++) {
		if(object[i].isPhysical == true && object[i].playerControl != true){
			var distance = vec3.distance(object[i].objectPosition, newPosition);
			//console.log(i + ' ' + distance + ' ' + lowestDistance);
			if(lowestDistance==null||distance<lowestDistance) {
				lowestDistance = distance;
				closestObject = i;
			}
		}
	}
	
	document.getElementById("collisionID").innerHTML = closestObject;
	//ObjectRayIntersectionTest();
	
	var newCoord = ObjectRayIntersection([object[closestObject].objectRotatedVertices[0], object[closestObject].objectRotatedVertices[1], object[closestObject].objectRotatedVertices[2]],
	[object[closestObject].objectRotatedVertices[3], object[closestObject].objectRotatedVertices[4], object[closestObject].objectRotatedVertices[5]],
	[object[closestObject].objectRotatedVertices[6], object[closestObject].objectRotatedVertices[7], object[closestObject].objectRotatedVertices[8]], 
	newPosition,
	object[closestObject].objectPosition,
	-0.5);
	
	//console.log('new tests');
	//ObjectTriRayIntersection(rayOrigin, rayLength, vertex1, vertex2, vertex3){
	//ObjectTriRayIntersection(newPosition, -0.5, object[closestObject].objectRotatedVertices[0], object[closestObject].objectRotatedVertices[1], object[closestObject].objectRotatedVertices[2]);
	
	return newCoord;
	
	/*if(newPosition[0] >= objectPositions[closestObject][0]-1 && newPosition[0] <= objectPositions[closestObject][0]+1 && 
		newPosition[1] >= objectPositions[closestObject][1]-1 && newPosition[1] <= objectPositions[closestObject][1]+1 &&
		newPosition[2]-0.83 >= objectPositions[closestObject][2]-0.03 && newPosition[2]-0.83 <= objectPositions[closestObject][2]+0.03 ) //player height/origin is input manually here, needs to be more dynamic in future
		{playerTranslation[0][2] = objectPositions[closestObject][2]+0.83;
		return true;}
	else
		return false;*/
}

function CanPlayerMoveInArea(playerPosition, playerInput){
	var newPosition = [playerPosition[0] + playerInput[0],playerPosition[1] + playerInput[1],playerPosition[2] + playerInput[2]];
	var lowestDistance, closestObject;
	
	var totalObjectCount = object.length;
	
	for(var i = 0; i < totalObjectCount; i++) {
		if(object[i].isPhysical == true && object[i].playerControl != true){
			var distance = vec3.distance(object[i].objectPosition, newPosition);
			//console.log(i + ' ' + distance + ' ' + lowestDistance);
			if(lowestDistance==null||distance<lowestDistance) {
				lowestDistance = distance;
				closestObject = i;
			}
		}
	}
	
	
	
	
	var closestVertices = [[object[closestObject].objectRotatedVertices[0],object[closestObject].objectRotatedVertices[1],object[closestObject].objectRotatedVertices[2]],
							[object[closestObject].objectRotatedVertices[3],object[closestObject].objectRotatedVertices[4],object[closestObject].objectRotatedVertices[5]],
							[object[closestObject].objectRotatedVertices[6],object[closestObject].objectRotatedVertices[7],object[closestObject].objectRotatedVertices[8]]];
					
	var closestVerticesDist = [vec3.distance([object[closestObject].objectRotatedVertices[0],object[closestObject].objectRotatedVertices[1],object[closestObject].objectRotatedVertices[2]], newPosition),
								vec3.distance([object[closestObject].objectRotatedVertices[3],object[closestObject].objectRotatedVertices[4],object[closestObject].objectRotatedVertices[5]], newPosition),
								vec3.distance([object[closestObject].objectRotatedVertices[6],object[closestObject].objectRotatedVertices[7],object[closestObject].objectRotatedVertices[8]], newPosition)];
				
				
	//var test = PointSideOfLine(closestVertices[0], closestVertices[1], newPosition);
	//console.log(test);
	
	/*This is a really trashy and ineffective way of comparison. This will need to be updated later on*/
	/*var numberOfAdditionalVerticesSet = 1; //This needs to be updated to be more dynamic				
	for(var i = 0; i < numberOfAdditionalVerticesSet; i++) {
		var distance = vec3.distance([object[closestObject].vertexCoordinates[i*9],object[closestObject].vertexCoordinates[i*9+1],object[closestObject].vertexCoordinates[i*9+2]], newPosition);
		var largestDifference = null;
		var currentLargest = -1;
		for(var j = 0; j < 3; j++){
			//document.getElementById("collisionCoord").innerHTML = distance + " ; " + closestVerticesDist[j];
			if(distance < closestVerticesDist[j]) {
				var difference = distance - closestVerticesDist[j];
				if(largestDifference == null) {
					largestDifference = difference;
					currentLargest = j;
				}else if(difference > largestDifference){
					largestDifference = difference;
					currentLargest = j;
				}
			}
		}
		document.getElementById("collisionCoord").innerHTML = currentLargest;
		if(currentLargest != -1) {
			closestVertices[currentLargest] = [object[closestObject].vertexCoordinates[i*9],object[closestObject].vertexCoordinates[i*9+1],object[closestObject].vertexCoordinates[i*9+2]];
		}
	}*/
	//document.getElementById("collisionCoord").innerHTML = closestVertices[0][2] + ' ' + closestVertices[1][2] + ' ' + closestVertices[2][2];
	
	document.getElementById("collisionID").innerHTML = closestObject;
	//ObjectRayIntersectionTest();
	
	/*ObjectRayIntersection(closestVertices[0],
	closestVertices[1],
	closestVertices[2], 
	newPosition,
	object[closestObject].objectPosition,
	-0.5);*/
	
	var coordinates = CanObjectMove([object[playerObjectIds].objectPosition[0],object[playerObjectIds].objectPosition[1],object[playerObjectIds].objectPosition[2]],playerInput);
	//console.log('test:');
	//console.log(coordinates);
	
	/*Find the distance of the z values (to update to all axis in future*/
	var newZ = 0;
	var falling = false;
	var distance = vec3.distance(coordinates, newPosition);
	//console.log(newPosition);
	if(distance <= 1){//newPosition[2] - coordinates[2] < 1.1 && newPosition[2] - coordinates[2] > 0.9){ //Player height is calculated in - needs to be more dynamic
		//newZ = parseFloat(test[2]) + 1.5;
		isPlayerOnFloor = true;
		newZ = 0.0;
	}else{
		//falling = true;
		isPlayerOnFloor = false;
		newZ = -0.1;
	}
		
	
	/*
	ObjectRayIntersection([object[test].vertexCoordinates[0], object[test].vertexCoordinates[1], object[test].vertexCoordinates[2]],
	[object[test].vertexCoordinates[3], object[test].vertexCoordinates[4], object[test].vertexCoordinates[5]],
	[object[test].vertexCoordinates[6], object[test].vertexCoordinates[7], object[test].vertexCoordinates[8]], 
	newPosition,
	objectPositions[test],
	0.5);
	*/
	
	/*console.log('newPosition');
	console.log(newPosition);
	console.log('objectPositions');
	console.log(objectPositions[closestObject]);*/
	
	/*IsPointInPlane([object[closestObject].vertexCoordinates[0], object[closestObject].vertexCoordinates[1], object[closestObject].vertexCoordinates[2]],
	[object[closestObject].vertexCoordinates[3], object[closestObject].vertexCoordinates[4], object[closestObject].vertexCoordinates[5]],
	[object[closestObject].vertexCoordinates[6], object[closestObject].vertexCoordinates[7], object[closestObject].vertexCoordinates[8]], 
	newPosition,
	objectPositions[closestObject]);*/
	if(newPosition[0] >= object[closestObject].objectPosition[0]-1 && newPosition[0] <= object[closestObject].objectPosition[0]+1 && 
		newPosition[1] >= object[closestObject].objectPosition[1]-1 && newPosition[1] <= object[closestObject].objectPosition[1]+1  ) //player height/origin is input manually here, needs to be more dynamic in future
		{//playerTranslation[0][2] = objectPositions[closestObject][2]+0.83;
		return [coordinates[0],coordinates[1],coordinates[2]+1,newZ,falling];} 
	else
		return false;
}

function MoveCamera(x,y,z,pos) {
	newCameraEye =  [initCameraEye[0]-pos[0],initCameraEye[1]+pos[1],initCameraEye[2]+pos[2]+5];
	//cameraCentre = [cameraCentre[0]+x,cameraCentre[1]+y,cameraCentre[2]+z];
	newCameraCentre = [-pos[0],pos[1],pos[2]];
	mat4.lookAt(viewMatrix, newCameraEye, newCameraCentre, cameraUp);
}

function UpdatePlayerPosition(){
	if(playerObjectIds!=null){
		//console.log(playerUpdateVector);
		var canPlayerMoveInArea = CanPlayerMoveInArea([object[playerObjectIds]['objectPosition'][0],object[playerObjectIds]['objectPosition'][1],object[playerObjectIds]['objectPosition'][2]],[playerUpdateVector[0]*time*speed,playerUpdateVector[1]*time*speed,playerUpdateVector[2]*time*speed]);
		if(canPlayerMoveInArea!=false) {	
			object[playerObjectIds]['objectPosition'][0] = canPlayerMoveInArea[0];
			object[playerObjectIds]['objectPosition'][1] = canPlayerMoveInArea[1];
			//console.log(playerIsJumping + ' ' + isPlayerOnFloor);
			//console.log(canPlayerMoveInArea[3]);
			if(!playerIsJumping&&isPlayerOnFloor){
				//playerUpdateVector[2] = canPlayerMoveInArea[2];
				//console.log('a');
				playerUpdateVector[2] = canPlayerMoveInArea[3];
				object[playerObjectIds]['objectPosition'][2] = canPlayerMoveInArea[2];
			}else if(!playerIsJumping&&!isPlayerOnFloor){
				console.log('b');
				playerUpdateVector[2] = canPlayerMoveInArea[3]*time*speed;
				object[playerObjectIds]['objectPosition'][2] = object[playerObjectIds]['objectPosition'][2] + playerUpdateVector[2];
			} else {
				console.log('c');
				Jump();
				object[playerObjectIds]['objectPosition'][2] = object[playerObjectIds]['objectPosition'][2] + playerUpdateVector[2];
			}
			MoveCamera(-playerUpdateVector[0],playerUpdateVector[1],playerUpdateVector[2], object[playerObjectIds]['objectPosition']);
		} else {
			console.log('2');
			object[playerObjectIds]['objectPosition'][0] = object[playerObjectIds]['objectPosition'][0] + playerUpdateVector[0];
			object[playerObjectIds]['objectPosition'][1] = object[playerObjectIds]['objectPosition'][1] + playerUpdateVector[1];
			if(!godMode && !playerIsJumping)
				playerUpdateVector[2] = -0.05;
			if(playerIsJumping) {
				Jump();
			}
			object[playerObjectIds]['objectPosition'][2] = object[playerObjectIds]['objectPosition'][2] + playerUpdateVector[2];
			MoveCamera(-playerUpdateVector[0],playerUpdateVector[1],playerUpdateVector[2],  object[playerObjectIds]['objectPosition']);
		}
		
		document.getElementById("playerX").innerHTML = object[playerObjectIds]['objectPosition'][0];
		document.getElementById("playerY").innerHTML = object[playerObjectIds]['objectPosition'][1];
		document.getElementById("playerZ").innerHTML = object[playerObjectIds]['objectPosition'][2];
	}
}

function Jump(){
	console.log('jump ' + playerJumpTime);
	playerJumpTime += time;
	if(playerJumpTime > 0.6){
		playerIsJumping = false;
		playerJumpTime = 0;
		playerUpdateVector[2] = -0.05;
	} else {
		playerUpdateVector[2] = 0.05;
	}
}



function InitPlayer(){
	console.log('1:');
	console.log(buffersArray);
	//playerTranslation.push([0,0,-4]);
	//currPlayerId = playerTranslation.length - 1;
	var objDetails = JSON.parse(RequestObjectDetails(2));
	object.push({
		vertexCoordinates:objDetails['vertexCoordinates'],
		vertexIndices:objDetails['vertexIndices'],
		vertexNormals:objDetails['vertexNormals'],
		textureCoordinates:objDetails['textureCoordinates'],
		objectPosition:[1,0,-4],
		objectRotation:[1.5*pi,0,0.5*pi],
		objectRotatedVertices: GetRotatedVertices(objDetails['vertexCoordinates'], [0,0,0]),
		texture:objDetails['textureLocation'],
		isTile:objDetails['isTile'],
		isPhysical:objDetails['isPhysical'],
		playerControl:true
	});
	playerObjectIds = object.length-1;
	console.log('2:');
	buffersArray.push(initBuffers(gl, 0, object[object.length-1]));
	texturesArray.push(loadTexture(gl, object[object.length-1].texture));
	numberOfObjects++;
}

/*
function AssignActive(){
	var offset = jQuery('.see-our-work-container * .qode_image_gallery_holder * li[class^="-"]').length / 4;
	var current = 0;
	console.log(offset + ' ' + current);
		jQuery('[active="active"]').each(function(){
				jQuery(this).attr('active','');
	   });
	var lengthOfSlider = (jQuery('.see-our-work-container * .qode_image_gallery_holder * li').length - jQuery('.see-our-work-container * .qode_image_gallery_holder * li[class^="-"]').length)/2;
	for(var i = 0; i < 3*offset; i++){
		if(jQuery('.see-our-work-container * li')[i].className == '-before active') {
			jQuery(jQuery('.see-our-work-container * .qode_image_gallery_holder * li')[i +offset]).attr('active','active');
			jQuery(jQuery('.see-our-work-container * .qode_image_gallery_holder * li')[i +2*offset]).attr('active','active');
			console.log('active 1');
		}else if(jQuery('.see-our-work-container * li')[i].className == 'active'){
			jQuery(jQuery('.see-our-work-container * .qode_image_gallery_holder * li')[i - offset]).attr('active','active');
			jQuery(jQuery('.see-our-work-container * .qode_image_gallery_holder * li')[i+offset]).attr('active','active');
			console.log('active 2');
		}else if(jQuery('.see-our-work-container * li')[i].className == '-after active'){
			jQuery(jQuery('.see-our-work-container * .qode_image_gallery_holder * li')[i - offset]).attr('active','active');
			jQuery(jQuery('.see-our-work-container * .qode_image_gallery_holder * li')[i-2*offset]).attr('active','active');
			console.log('active 3');
		}
	}
}
*/