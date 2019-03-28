var cubeRotation = 0.0;
const pi = 3.142;
var mouseData = [0,0];
var pixelData = [0,0,0,0];
var playerTranslation = [];//[0,0,-4.159],[0,0,0]]; //temporary for translating the players position obviously this would be in some kind of object but ill sort that shit out when i move to a node package 
var playerObjectIds = null;
var playerRayLength = 0.5;
var objectPositions = [
	[2,2,-6], //"mouse"
	[0,0,-6],
	[3,0,-6],
	[-2,0,-6],
	[-2,2,-6],
	[-2,-2,-6],
	[2,2,-6],
	[2,-4,-6],
	[-2,-6,-6],
	[-4,2,-8],
];
var numberOfObjects = 0;
var numberOfPlayers = 1;
var collidedWithObject = -1;
var rotationX=0, rotationY=0, rotationZ=0;
var projectionMatrix = mat4.create();
var viewMatrix = mat4.create();
var initCameraEye = [0,-8,6];
var initCameraCentre = [0,0,-5.9];
var cameraUp = [0,1,0];
var newCameraEye = initCameraEye;
var newCameraCentre = initCameraCentre;
mat4.lookAt(viewMatrix, newCameraEye, newCameraCentre, cameraUp);
var onCurrentObjectNumber = 1;
var updatePlayerPosition = setInterval(function(){UpdatePlayerPosition();}, 10);
var playerUpdateVector = [0,0,0];
var playerIsJumping = false;
var playerJumpTime = 0;
var godMode = false;
var time = 0;
const speed = 100;
var isPlayerOnFloor = false;
var currentPlayerDirection = [0,0,0,0]; //redundant
var currentPlaneEquation = [0,0,0,0,0]; //x, y, z, d, t
var currPlayerId = -1;
var doonce = false;
  var buffersArray = [];
  var texturesArray = [];
    const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');