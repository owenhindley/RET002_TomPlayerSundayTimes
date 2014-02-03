<?php
	
	date_default_timezone_set('Europe/London');

	require_once("libs/PHPMailerAutoload.php");
	
	/* Generic class to handle submission of user data to email endpoint */

	abstract class EndpointGenericHandler{

	

		function __construct(){
		
		}

		public function checkBrowserVersion($minIeVersion){

			$browser = get_browser(null, true);

			if ($browser["browser"] == "IE"){
				if (intval($browser["majorver"]) >= $minIeVersion){
					return true;
				} else return false;
			} else return true;
		}

		public function handleRequest($postVars, $id, $targetAddress){

			// override this method
			return false;

		}


		function returnFile($filePath) {

			ob_clean();

			$extension = strtoupper(pathinfo($filePath, PATHINFO_EXTENSION));


			switch($extension){

				case "JPEG":
					header('Content-Type: image/jpeg');

				break;

				case "JPG":
					header('Content-Type: image/jpeg');
				break;

				case "GIF":
					header('Content-Type: image/gif');
				break;

				default:
					header('Content-Type: text/html');
				break;

			}

			readfile($filePath);

		}


		function getSanitisedRequestInput($postVars, $fieldName, $filterType = FILTER_SANITIZE_STRING) {

			if (!array_key_exists($fieldName, $postVars)){
				$this->endpointError("Error getting sanitised input from request, could not find field name " . $fieldName . " in " . implode($postVars));
				return;
			}

			$unsanitised = $postVars[$fieldName];
			$sanitised = "";
			if ($filterType){
				$sanitised = filter_var($unsanitised, $filterType);
			} else {
				$sanitised = filter_var($unsanitised, FILTER_SANITIZE_STRING);
			}

			return $sanitised;
		}

	}

?>