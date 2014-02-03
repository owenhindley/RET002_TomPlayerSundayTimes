<?php

ini_set('display_errors', '1');
require_once("classes/EndpointSubmitHandler.php");


$handler = new EndpointSubmitHandler();

$submitResult = $handler->handleRequest($_POST, "owenhindley@hotmail.com");		

if ($submitResult){
	// do something
} else
{
	// do something else
}




?>