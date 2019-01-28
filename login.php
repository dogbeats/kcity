<?php 
session_start();
if (!isSet($_SESSION['userid']))
{
?>
<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<link rel="stylesheet" type="text/css" href="css/login.css"/>
</head>

<body>
<main class="flex">
	<div id="login-box">
		<h1>Log in</h1>
		<form id="login-form" name="login-form" method="POST" action="check-login.php">
		<input id="username" name="username" autocomplete="off" placeholder="Username" type="text" required value=""></input>
		<input id="password" name="password" placeholder="Password" type="password" required value=""></input>
		<input id="play" value="Play" type="submit"></input>
		</form>
		
		<p>Don't have an account? <a href="create-account.php">Sign up now!</a></p>
	</div>
</main>
</body>
</html>

<?php 
}
else {
	header('Location: index.php');
}