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
<script type="text/javascript" src="player.js"></script>


</head>

<body class="settings">

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

<main>
	<div id="settings-area">
		<div id="settings-menu">
			<ul>
				<li class="active">User Info</li>
				<li>Privacy</li>
				<li>Security</li>
			</ul>
		</div>
		<div id="settings-change">
			<form name="user-info" method="POST" action="update.php">
				<h3>User Info</h3>
				<input class="settings-input" type="text" value="<?php echo $_SESSION['username']; ?>"></input>
				<input class="settings-input" type="text" value="Email"></input>
				<?php 
					if(isSet($_SESSION['isValidated']) && $_SESSION['isValidated'] == 0)
				{
					echo '<span>Note: This email address has not yet been validated.</span>';
				}
				?>
				<select class="settings-input" name="languages">
					<option value="en-gb">English</option>
					<option value="en-us">English (US)</option>
				</select>
				<input type="submit" value="Update"></input>
			</form>
		</div>
	</div>
</main>



</body>
</html>

<?php 
}

?>