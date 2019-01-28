<?php 
session_start();
if(!isSet($_SESSION['userid']))
{
	header('Location: login.php');
}
else
{
?>

<!DOCTYPE html>
<html>
<head>
<title>Project</title>
<script type="text/javascript" src="client.js"></script>

	<style>
	#glcanvas {
		position:absolute;
		top: 0;
		left: 0;
	}
	.glcanvascontainer{
	height: 500px;
	}
	</style>

</head>

<body>

<?php 
	echo '<li id="id">'.$_SESSION['userid'].'</li>';
	echo '<li id="username">'.$_SESSION['username'].'</li>';
	echo '<li id="rank">'.$_SESSION['rank'].'</li>';
?>

<form name="logout" method="POST" action="check-login.php">
<input id="logout" name="logout" type="submit" value="Log out"></input>
</form>

 <div class="glcanvascontainer">
    <canvas id="glcanvas" width="640" height="480" style=""></canvas>
	</div>
		<p>Mouse X: <span id="mouseX"></span></p>
		<p>Mouse Y: <span id="mouseY"></span></p>
		<p>Pixel Colour: <span id="pixelColour"></span></p>
  </body>

  <script src="gl-matrix.js"></script>
  <script src="webgl-demo.js"></script>


</body>
</html>

<?php 
}

?>