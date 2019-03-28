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
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<script type="text/javascript" src="eventhandler.js"></script>
<script type="text/javascript" src="player.js"></script>
<script type="text/javascript" src="client.js"></script>

	<style>
	#glcanvas {
		position:relative;
	}
	.glcanvascontainer{
	height: 500px;
	}
	</style>

</head>

<body>

<header>
	<div id="header-wrap">
		<div id="project-name">
			<h2><a href="index.php">KCity</a></h2>
		</div>
		<div id="user-box">
			<div id="user-name">
				<p><?php echo $_SESSION['username']; ?></p>
			</div>
			<div id="menu-hover">
				<i class="expander"></i>
				<ul id="user-menu">
					<li><a href="settings.php">Settings</a></li>
					<li><a href="logout.php">Log out</a></li>
				</ul>
			</div>
		</div>
	</div>
</header>

<?php 
	echo '<li id="id">'.$_SESSION['userid'].'</li>';
	echo '<li id="username">'.$_SESSION['username'].'</li>';
	echo '<li id="rank">'.$_SESSION['rank'].'</li>';
	if (isSet($_SESSION['isValidated']) && $_SESSION['isValidated'] == 0)
	{
		echo '<li id="invalid">Email address not validated. Click <a target="_blank" href="validate.php?token='.$_SESSION['userid'].'">here</a> to validate it.</li>';
	}
?>


<div id="chat-area">
	<textarea id="chat-log"></textarea>
	<input id="chat-box" placeholder="Enter your message here..."></input>
</div> 

<form name="logout" method="POST" action="check-login.php">
<input id="logout" name="logout" type="submit" value="Log out"></input>
</form>

<div class="glcanvascontainer">
    <canvas id="glcanvas" width="640" height="480" style=""></canvas>
	</div>
		<p>Mouse X: <span id="mouseX"></span></p>
		<p>Mouse Y: <span id="mouseY"></span></p>
		<p>Pixel Colour: <span id="pixelColour"></span></p>

  <script src="gl-matrix.js"></script>
  <script src="webgl-demo.js"></script>
</body>
</html>

<?php 
}

?>