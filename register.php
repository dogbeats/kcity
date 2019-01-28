<?php 
if($_SERVER['REQUEST_METHOD'] == "POST")
{
	if (isSet($_POST['username']) && isSet($_POST['password']) && isSet($_POST['confirm']) && isSet($_POST['email']))
	{
		if($_POST['password'] != $_POST['confirm'])
		{
			header('Location: create-account.php?m=3');
		}
		else
		{
			session_start();
			date_default_timezone_set('UTC');
			$host = '<DBHOST>';
			$db = '<DBNAME>';
			$user = '<DBUSER>'; //This user can only read, edit and delete data. It does not have the ability to delete tables etc. Will change eventually.
			$pass = '<DBPASSWORD>';
			$charset = 'utf8';
			//Will move all of the above into a separate config file eventually

			$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
			$pdo = new PDO($dsn,$user,$pass);
			$pswd = password_hash($_POST['password'], PASSWORD_DEFAULT);
			$stmt = $pdo->prepare("INSERT INTO users (userID, username, password, rank, creationDate) values (:id, :username, :password, :rank ,:creationDate)");
			$stmt->execute(['id' => mt_rand(1, 9999), 'username' => $_POST['username'], 'password' => $pswd, 'rank' => 1, 'creationDate' => date("Y-m-d")]);
			if ($stmt->rowCount() > 0)
			{
				header('Location: create-account.php?m=1');
			}
			else
			{
				header('Location: create-account.php?m=2');
			}
		}
	}
}

?>