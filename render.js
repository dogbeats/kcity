main();

//
// Start here
//
function main() {
	
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  
  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

	uniform mat4 uViewMatrix;
	uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
	varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
	  
	  
      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
      highp vec3 directionalLightColor = vec3(0.2, 0.6, 0.6);
      highp vec3 directionalVector = normalize(vec3(0.85, -1.8, -0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program
  const fsSource = `
    varying highp vec2 vTextureCoord;
	varying highp vec3 vLighting;

    uniform sampler2D uSampler;
	uniform bool uHighlighted;
	uniform highp float u_time;
	
    void main(void) {
      highp vec4 texColor = texture2D(uSampler, vTextureCoord);
		if(texColor.a < 0.1)
			discard;
		if(uHighlighted == true)
			gl_FragColor = vec4(vec3(texColor.r*2.0, texColor.g, texColor.b)*vLighting, texColor.a);
		else
			gl_FragColor = vec4(texColor.r, texColor.g*2.0, texColor.b, texColor.a);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aTextureCoord and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
	  vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
	  normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
	  viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
	  highlighted: gl.getUniformLocation(shaderProgram, 'uHighlighted'),
    },
  };

  //numberOfPlayers = playerTranslation.length;
  
  var keys = Object.keys(levelObjects['objects']);
  console.log(keys);
  numberOfObjects = keys.length;
  var itemsToDraw = numberOfObjects;
  
  for(var i = 0; i < numberOfObjects; i++){
	  var objId = levelObjects['objects'][keys[i]]['objectId'];
	  var objDetails = JSON.parse(RequestObjectDetails(objId));
	  if(levelObjects['objects'][keys[i]]['playerControl']==true)
		  playerObjectIds = i;
	  object.push({
			vertexCoordinates:objDetails['vertexCoordinates'],
			vertexIndices:objDetails['vertexIndices'],
			vertexNormals:objDetails['vertexNormals'],
			textureCoordinates:objDetails['textureCoordinates'],
			objectPosition:levelObjects['objects'][keys[i]]['objectPosition'],
			objectRotation:levelObjects['objects'][keys[i]]['objectRotation'],
			objectRotatedVertices: GetRotatedVertices(objDetails['vertexCoordinates'], levelObjects['objects'][keys[i]]['objectRotation']),
			texture:objDetails['textureLocation'],
			isTile:objDetails['isTile'],
			isPhysical:objDetails['isPhysical'],
			playerControl:levelObjects['objects'][keys[i]]['playerControl']
	  });
	  buffersArray.push(initBuffers(gl, 0, object[object.length-1]));
  }

  //object[0].isPhysical = false;

  /*for(var i = 0; i < numberOfPlayers; i++){
	  object.push({
			vertexCoordinates:GetObjectVertices(1),
			vertexIndices:GetObjectIndices(0),
			vertexNormals:GetObjectNormal(0),
			textureCoordinates:GetObjectTextureCoordinates(0),
			objectPosition:playerTranslation[0],
			objectRotation:[0.5*pi,0,1.5*pi],
			objectRotatedVertices: GetRotatedVertices(GetObjectVertices(0), [0.5*pi,0,1.5*pi]),
			texture:GetObjectTexture(1),
			isTile:false
	  });
	  buffersArray.push(initBuffers(gl, 0, object[object.length-1]));
  }*/
  
  for(var i = 0; i < numberOfObjects; i++){
	texturesArray.push(loadTexture(gl, object[i].texture));  
  }
  
  
  
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffersArray = [initBuffers(gl, 0, object[0]),initBuffers(gl, 1, object[1])];
  //const texture = loadTexture(gl, object[1].texture);
  //const texture2 = loadTexture(gl, object[1].texture);
	
  var then = 0;

  var data = document.getElementById('glcanvas').getBoundingClientRect();
  
  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
	time = deltaTime;
	
	drawScene(gl, programInfo, buffersArray, texturesArray, deltaTime);
    //drawScene(gl, programInfo, [buffersArray[0],buffersArray[1]], [texture2, texture], deltaTime);
	//drawScene(gl, programInfo, buffersArray[1], texture, deltaTime);
	/**TESTING GETITNG PIXEL COLOUR**/

	//ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
	
	
	/**END**/
	
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl, num, objects) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.vertexCoordinates), gl.STATIC_DRAW);

  // Now set up the texture coordinates for the faces.

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.textureCoordinates),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(objects.vertexIndices), gl.STATIC_DRAW);
	  

	const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.vertexNormals),gl.STATIC_DRAW);   
	   
  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
	normal: normalBuffer,
  };
 
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
	const canvas = document.getElementById('glcanvas');
  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 0]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
	  
	canvas.imageSmoothingEnabled = false;
	canvas.mozImageSmoothingEnabled = false;
	canvas.oImageSmoothingEnabled = false;
	canvas.webkitImageSmoothingEnabled = false;
	canvas.msImageSmoothingEnabled=false;
	
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    //if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
    //   gl.generateMipmap(gl.TEXTURE_2D);
    //} else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //}
  };
  image.src = url;
  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 1.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
				   
 var itemsToDraw = numberOfObjects;
 
	for(var i = 0; i < itemsToDraw; i++)//switch to look at buffer size
	{	
	  // Set the drawing position to the "identity" point, which is
	  // the center of the scene.
	  const modelViewMatrix = mat4.create();

	  // Now move the drawing position a bit to where we want to
	  // start drawing the square.

	  mat4.translate(modelViewMatrix,     // destination matrix
					 modelViewMatrix,     // matrix to translate
					 [-object[i].objectPosition[0], object[i].objectPosition[1], object[i].objectPosition[2]]);  // amount to translate
	  mat4.rotate(modelViewMatrix,  // destination matrix
				  modelViewMatrix,  // matrix to rotate
				  object[i].objectRotation[0],     // amount to rotate in radians
				  [1, 0, 0]);       // axis to rotate around (X)
	  mat4.rotate(modelViewMatrix,  // destination matrix
				  modelViewMatrix,  // matrix to rotate
				  object[i].objectRotation[1],     // amount to rotate in radians
				  [0, 1, 0]);       // axis to rotate around (Y)
	 mat4.rotate(modelViewMatrix,  // destination matrix
				  modelViewMatrix,  // matrix to rotate
				  object[i].objectRotation[2],     // amount to rotate in radians
				  [0, 0, 1]);       // axis to rotate around (Z)
	  
	const normalMatrix = mat4.create();
	mat4.invert(normalMatrix, modelViewMatrix);
	mat4.transpose(normalMatrix, normalMatrix);			  

	  // Tell WebGL how to pull out the positions from the position
	  // buffer into the vertexPosition attribute
	  {
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i].position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexPosition);
	  }
	  
	  // Tell WebGL how to pull out the vertexNormal coordinates from
	  // the vertexNormal coordinate buffer into the vertexNormal attribute.
	  {
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i].normal);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexNormal,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexNormal);
	  }

	  // Tell WebGL how to pull out the texture coordinates from
	  // the texture coordinate buffer into the textureCoord attribute.
	  {
		const numComponents = 2;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i].textureCoord);
		gl.vertexAttribPointer(
			programInfo.attribLocations.textureCoord,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.textureCoord);
	  }

	  // Tell WebGL which indices to use to index the vertices
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[i].indices);

	  // Tell WebGL to use our program when drawing

	  gl.useProgram(programInfo.program);

	  // Set the shader uniforms

	  gl.uniformMatrix4fv(
		  programInfo.uniformLocations.projectionMatrix,
		  false,
		  projectionMatrix);
	  gl.uniformMatrix4fv(
		  programInfo.uniformLocations.modelViewMatrix,
		  false,
		  modelViewMatrix);
	  gl.uniformMatrix4fv(
		  programInfo.uniformLocations.normalMatrix,
		  false,
		  normalMatrix);
	  gl.uniformMatrix4fv(
		  programInfo.uniformLocations.viewMatrix,
		  false,
		  viewMatrix);

	  // Specify the texture to map onto the faces.

	  // Tell WebGL we want to affect texture unit 0
	  gl.activeTexture(gl.TEXTURE0);

	  // Bind the texture to texture unit 0
	  gl.bindTexture(gl.TEXTURE_2D, texture[i]);

	  // Tell the shader we bound the texture to texture unit 0
	  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
	  
	  // Set if highlighted
	  gl.uniform1i(programInfo.uniformLocations.highlighted, 1);

	  {
		const vertexCount = 6; //need to update dynamically
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	  }
	}
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/*CUSTOM*/
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getRelativeMousePosition(event, target) {
  target = target || event.target;
  var rect = target.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}


function mouseMove(e, t){
	document.getElementById('mouseX').innerHTML = e.clientX;
	document.getElementById('mouseY').innerHTML = e.clientY;
	
	var pos = getRelativeMousePosition(e, t);
	const glx = pos.x / 640  *  2 - 1; //replace 640 and 480 with width and height
	const gly = pos.y / 480 * -2 + 1;
	var toWorldSpace = unproject2([glx, gly, 0], viewMatrix, projectionMatrix, [0,0,1,1]);

	/*line between mouse and camera, to move*/
	//var difference = [toWorldSpace[0] - cameraEye[0],toWorldSpace[1] - cameraEye[1],toWorldSpace[2] - cameraEye[2]]
	//var difference = [toWorldSpace[0] - cameraEye[0],toWorldSpace[1] - cameraEye[1],toWorldSpace[2] - cameraEye[2]]

	//object[0].objectPosition[0] = (-cameraEye[0]-200*difference[0]);
	//object[0].objectPosition[1] = (cameraEye[1]+200*difference[1]);
	//object[0].objectPosition[2] = (cameraEye[2]+200*difference[2]);
	
	//object[0].objectPosition[0] = playerTranslation[0][0] ;
	//object[0].objectPosition[1] = playerTranslation[0][1] ;
	//object[0].objectPosition[2] = playerTranslation[0][2] - 1;
	
	document.getElementById('GLmouseX').innerHTML = glx;
	document.getElementById('GLmouseY').innerHTML = gly;
	mouseData = [e.clientX, e.clientY];
	document.getElementById('pixelColour').innerHTML = pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', ' + pixelData[3];
	/*var pos = findPos(this);
    var x = e.pageX - pos.x;
	var pixel = new Uint8Array(4);
	pixel[0] = 10;
    var y = e.pageY - pos.y;
	var canvas = document.getElementById('glcanvas');
	var ctx = canvas.getContext('webgl');
	//ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
	ctx.readPixels(82, 2, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, pixel)
	console.log(pixel); // CanvasRenderingContext2D { ... }*/
}

document.getElementsByTagName('canvas')[0].addEventListener('mousemove', mouseMove, false);

document.getElementsByTagName('body')[0].onkeydown = function(e) {KeyPress(e)};
document.getElementsByTagName('body')[0].onkeyup = function(e) {KeyUp(e)};

var info = {
	newPosX:0,
	newPosY:0
};

function KeyPress(e) {
	//console.log(e);
	switch(e.keyCode){
		case 16: //left shift
			if(godMode) {
				playerUpdateVector[2]=0;
				godMode = false;
				console.log('godmode inactive');
			} else {
				godMode = true;
				console.log('godmode active');
			}
			break;
		case 32: //space
			e.preventDefault();
			if(godMode)
				playerUpdateVector[2]=0.05;
			break;
		case 81: //q
			object[2].objectRotation[1] += 0.1;
			object[2].objectRotatedVertices = GetRotatedVertices(object[2].vertexCoordinates, [rotationX,object[2].objectRotation[1],rotationZ]);
			console.log(object[2].objectPosition[0] + object[2].objectRotatedVertices[0]);
			console.log(object[2].objectPosition[2] + object[2].objectRotatedVertices[8]);
			break;
		case 87: //w
			if(playerObjectIds==null){
				InitPlayer();
			}else{
				playerUpdateVector[1]=0.05;
			}
				console.log('playerpos');
	console.log(object[playerObjectIds]['objectPosition']);
			break;
		case 65: //a
			playerUpdateVector[0]=0.05;
			document.getElementById('rotationX').innerHTML = rotationX;
			break;
		case 83: //s
			playerUpdateVector[1]=-0.05;
			document.getElementById('rotationY').innerHTML = rotationY;
			break;
		case 68: //d
			playerUpdateVector[0]=-0.05;
			document.getElementById('rotationZ').innerHTML = rotationZ;
			break;
		case 38: //up arrow
			object[playerObjectIds]['objectPosition'][1]+=0.05;
			break;
		case 37: //left arrow
			object[playerObjectIds]['objectPosition'][0]+=0.05;
			//rotationX += 0.1;
			document.getElementById('rotationX').innerHTML = rotationX;
			break;
		case 40: //down arrow
			object[playerObjectIds]['objectPosition'][1]-=0.05;
			//rotationY += 0.1;
			document.getElementById('rotationY').innerHTML = rotationY;
			break;
		case 39: //right arrow
			object[playerObjectIds]['objectPosition'][0]-=0.05;
			//rotationZ += 0.1;
			document.getElementById('rotationZ').innerHTML = rotationZ;
			break;
		default:
			console.log('unregistered key press');
	}
	/*
	if(playerObjectIds!=-null){
		info = {
			newPosX:playerTranslation[playerObjectIds][0],
			newPosY:playerTranslation[playerObjectIds][1]
		};
	}
	*/
	//mainSocket.send(constructMsg("update", info));
}

function KeyUp(e) {
	switch(e.keyCode){
		case 32: //space
			playerUpdateVector[2]=0;
			playerIsJumping = true;
			break;
		case 87: //w
			playerUpdateVector[1]=0;
			break;
		case 65: //a
			playerUpdateVector[0]=0;
			break;
		case 83: //s
			playerUpdateVector[1]=0;
			break;
		case 68: //d
				playerUpdateVector[0]=0;
			break;
		default:
			console.log('unregistered key up');
	}
}

/* below can be deleted */
IsPointInPlane([1,-2,0],[3,1,4],[0,-1,2],[0,0,0],[0,10,0]);