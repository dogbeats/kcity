<?php 
session_start();
if (isSet($_SESSION['userid']))
{
	unset($_SESSION['userid']);
	unset($_SESSION['username']);
	unset($_SESSION['rank']);
	session_destroy();
	header('Location: login.php');
}
else 
{
	header('Location: login.php');
}
?>