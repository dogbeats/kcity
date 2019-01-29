<?php 
if ($_SERVER['REQUEST_METHOD'] == "POST")
{
	//Data is most likely coming from a form
	if(isSet($_POST['username']) && isSet($_POST['password']))
	{
		session_start();
		$host = '<DBHOST>';
		$db = '<DBNAME>';
		$user = '<DBUSER>'; 
		$pass = '<DBPASSWORD>';
		$charset = 'utf8';
		//Will move all of the above into a separate config file eventually

		$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
		$pdo = new PDO($dsn,$user,$pass);
		$stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(username)=:username");
		$stmt->execute(['username' => strtolower($_POST['username'])]);
		$result = $stmt->fetch();
		if (!empty($result))
		{
			if (password_verify($_POST['password'], $result['password']))
			{
				$_SESSION['userid'] = $result['userID'];
				$_SESSION['username'] = $result['username'];
				$_SESSION['rank'] = $result['rank'];
				header('Location: index.php');
			}
			else 
			{
				header('Location: login.php');
			}
		}
		else
		{
			header('Location: login.php?m=1');
		}
		
	}
	else if(isSet($_POST['logout']))
	{
		session_start();
		unset($_SESSION['userid']); 
		unset($_SESSION['username']);
		unset($_SESSION['rank']);
		session_destroy(); //Delete the session. Unset all session variables before this line.
		header('Location: login.php');
	}
}
else 
{
	header('Location: login.php');
	//User doesn't need to access this page. Send them packing.
}