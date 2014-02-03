<?php
	
	date_default_timezone_set('Europe/London');
	
	require_once("libs/PHPMailerAutoload.php");
	require_once("EndpointGenericHandler.php");

	/* Generic class to handle submission of user data to email endpoint */

	class EndpointSubmitHandler extends EndpointGenericHandler{

	
		public function handleRequest($postVars, $targetAddress){

			// get post vars and post to email address
			$userVars = $this->getPostVars($postVars);

			// validate post vars
			$validateResult = $this->validatePostVars($userVars);

			if ($validateResult == "OK"){

				if ($this->postToEmailAddress($userVars, $targetAddress)){

					$this->submitSuccess();

					// notifcation email to internal team
					// $notifcationVars = array(
					// 	"submitTime" => $userVars["submitTime"]								
					// );

					// $this->postToEmailAddress($notifcationVars, "xbox-glitch-notification-group@b-reel.com", $id);

					return true;

				} else {

					$this->rejectEntry("emailSubmitFail");
					return false;

				}	

			} else {
				$this->rejectEntry($validateResult);
			}				

		}

		function rejectEntry($errorCode) {
			
			header('Content-Type: application/json');
			$responseString = '{ "status" : "rejected", "data" : "'.$errorCode.'" }';
			echo($responseString);
			// header( 'Content-Length: '.obj_get_length( $responseString ));
			return false;
		}


		function submitSuccess() {
			

			header('Content-Type: application/json');

			$responseString = '{ "status" : "OK", "data" : "" }';
			echo($responseString);
			

		}

		function getPostVars($postVars) {

			// override this method if needs be
			$sanitisedUserVars = array(
				"email" => "",
				"name" => "",
				"address" => ""
			);

			$sanitisedUserVars["email"] = $this->getSanitisedRequestInput($postVars, "email", FILTER_SANITIZE_EMAIL);
			$sanitisedUserVars["firstName"] = $this->getSanitisedRequestInput($postVars, "firstName", null);
			$sanitisedUserVars["lastName"] = $this->getSanitisedRequestInput($postVars, "lastName", null);			
			$sanitisedUserVars["city"] = $this->getSanitisedRequestInput($postVars, "city", null);			
			$dobDay = $this->getSanitisedRequestInput($postVars, "dobDay", FILTER_SANITIZE_NUMBER_INT);
			$dobMonth = $this->getSanitisedRequestInput($postVars, "dobMonth", FILTER_SANITIZE_NUMBER_INT);
			$dobYear = $this->getSanitisedRequestInput($postVars, "dobYear", FILTER_SANITIZE_NUMBER_INT);

			$sanitisedUserVars["dob"] = $dobDay."/".$dobMonth."/".$dobYear;		
			$sanitisedUserVars["submitTime"] = date("Y-m-d H:i:s");

			return $sanitisedUserVars;
		}



		function postToEmailAddress($userVars, $targetAddress){

			$to = $targetAddress;
			$subject = "User Submission";
			$message = "User submitted their details as follows: \r\n";

			foreach ($userVars as $key => $val){
				$message = $message . $val."\r\n";
			}

			// return mail($to, $subject, $message);


			$mail = new PHPMailer;

			$mail->isSMTP();
			$mail->Host = "smtp.gmail.com";
			$mail->SMTPAuth = true;
			$mail->Username = 'tom.player.submit.system@gmail.com';
			$mail->Password = 'itisaj0yt05ubm1t';
			$mail->SMTPSecure = 'tls';
			$mail->Port       = 587;

			$mail->From = 'tom.player.submit.system@gmail.com';
			$mail->FromName = "User Submission for tomplayer.co.uk";
			$mail->addAddress($targetAddress);
			// $mail->addCC("owen.hindley@b-reel.com");


			$mail->Subject = $subject;
			$mail->Body = $message;

			if (!$mail->send()){
				$this->rejectEntry("email could not be sent : ". $mail->ErrorInfo);
				return false;
			} else return true;

		}

		function validatePostVars($userVars) {

			return "OK";
		}



	}

?>