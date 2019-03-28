<?php 
//This is just a mimic validation process, no validation actually happens. This'll be updated when the database becomes more fleshed out.

if(isSet($_GET['token']))
{
	session_start();
	if ($_GET['token'] == $_SESSION['userid'])
	{
		$_SESSION['isValidated'] = true;
		echo 'Email validated!';
	}
}

?>