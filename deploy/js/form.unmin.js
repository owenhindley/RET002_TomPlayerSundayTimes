
var checkboxChecked = false;

function runForm() {

	
	function setFormActive(aActive){
		if (aActive){
			$("#widgetInner").addClass("active");
		} else {
			$("#widgetInner").removeClass("active");			
		}
	}

	function setupForm() {

		if (!Modernizr.placeholder){


			var formElementIds = [
				"#form-firstName",
				"#form-lastName",
				"#form-email",				
				"#form-home",				
				"#form-dobDay",
				"#form-dobMonth",
				"#form-dobYear"				
			];

			for (var i=0; i< formElementIds.length; i++){

				var el = $(formElementIds[i]);
				$(el).addClass("placeholder");
				$(el).on("focus", function() {	

					if($(this).prop("tagName") == "INPUT"){
						$(this).attr("value","");	
					} else {
						$(this).html("");
					}
					

					$(this).off("focus");
					$(this).removeClass("placeholder");
				});

				if($(el).prop("tagName") == "INPUT"){
					$(el).attr("value", $(el).attr("placeholder"));	
				} else {
					$(el).html($(el).attr("placeholder"));
				}
				

			}	


		}


	};


	function highlightInvalid(aElement, aMessage){
		
		if (aElement) $(aElement).addClass("invalid");

		document.getElementById("errorMessage").innerHTML = aMessage;

		var originalValue = $(aElement).val();

		var changeCallback = function() {

			if ($(aElement).val() != originalValue){
				$(aElement).removeClass("invalid");
			}

			$(aElement).off("change", changeCallback);
		}

		$(aElement).on("change", changeCallback);

		return false;
	}

	function validateForms() {

		// clear the fields
		$.each($(".inputField"), function(index, value){
			$(value).removeClass('invalid');
		});

		document.getElementById("errorMessage").innerHTML = "";

		var firstName = document.getElementById("form-firstName").value;
		if (firstName == "") return highlightInvalid(document.getElementById("form-firstName"), "You must enter a first name.");

		var lastName = document.getElementById("form-lastName").value;
		if (lastName == "") return highlightInvalid(document.getElementById("form-lastName"), "You must enter a last name.");

		var email = document.getElementById("form-email").value;		
		if (email == "" || !isEmail(email)) return highlightInvalid(document.getElementById("form-email"), "You must enter a valid email address.");

		var homeAddress = document.getElementById("form-home").value;
		if (homeAddress == "") return highlightInvalid(document.getElementById("form-home"), "You must enter your town or city name");

		var dobDay = parseInt(document.getElementById("form-dobDay").value);
		if (isNaN(dobDay) || dobDay <= 0 || dobDay >= 32) return highlightInvalid(document.getElementById("form-dobDay"), "You must enter a valid day of birth.");

		var dobMonth = parseInt(document.getElementById("form-dobMonth").value);
		if (isNaN(dobMonth) || dobMonth <= 0 || dobMonth >= 13) return highlightInvalid(document.getElementById("form-dobMonth"), "You must enter a valid month.");

		var dobYear = parseInt(document.getElementById("form-dobYear").value);		
		if (isNaN(dobYear) || dobYear <= 0) return highlightInvalid(document.getElementById("form-dobYear"), "You must enter a valid year.");
		
		// var age = calcAge(dobYear + "/" + dobMonth + "/" + dobDay);
		// if (age < 18) return highlightInvalid(null, "You must be over 18 to proceed.");


		return {
			"firstName" : firstName,
			"lastName" : lastName,
			"email" : email,	
			"city" : homeAddress,		
			"dobDay" : dobDay,
			"dobMonth" : dobMonth,
			"dobYear" : dobYear		
		};
	}

	function performSubmit(aFormData) {

		if ($){
			$.ajax({
				url : document.location.href + "/backend/submit.php",
				data : aFormData,
				success : submitComplete,
				error : submitError,
				dataType : "json",
				type : "POST"
			});

		} else {
			submitError(null, null, "");			
		}
	
		setFormActive(false);

	};

	function submitError(xhr, status, error) {
		
		// if (console) console.log(error);

		highlightInvalid(null, "There was a problem submitting. Please try again.");
		$(acceptButton).addClass("active");

		setFormActive(true);
	};

	function submitComplete(aData){
	
		// aData = $.parseJSON(aData);

		setFormActive(true);

		if (aData){
			if (aData.status == "OK"){
				
				var formContainer = $("#formContainer");
				formContainer.removeClass("active");
				
				var downloadLink = $("#downloadLink");
				$(downloadLink).addClass("active");


			} else {
				switch(aData.data){

					case "invalidFirstName":
						highlightInvalid(document.getElementById("form-firstName"), "You must enter a valid first name.");
					break;
					case "invalidLastName":
						highlightInvalid(document.getElementById("form-lastName"), "You must enter a valid last name.");
					break;
					case "invalidEmail":
						highlightInvalid(document.getElementById("form-email"), "You must enter a valid email address.");
					break;					
					case "invalidAge":
						highlightInvalid(document.getElementById("form-dobDay"), "You must enter a valid date of birth and be over 18.");
					break;				
					case "emailSubmitFail":
						highlightInvalid(null, "There was a problem submitting. Please try again.");
					break;
					case "closed":
						document.loaction.reload();
					break;
				}
				$(acceptButton).addClass("active");
			}

		} else {
			submitError();
		}

	};


	var acceptCheckbox = document.getElementById("tcAccept");
	var acceptButton = document.getElementById("submitButton");

	acceptCheckbox.onclick = function() {


		checkboxChecked = !checkboxChecked;

		if (checkboxChecked){	
			$(acceptCheckbox).addClass("checked");
			$(acceptButton).addClass("active");
		} else {
			$(acceptCheckbox).removeClass("checked");
			$(acceptButton).removeClass("active");
		}
		return false;
	}

	acceptButton.onclick = function() {

		if (checkboxChecked){				
			
			var formData = validateForms();

			if (formData){
				$(acceptButton).removeClass("active");
				performSubmit(formData);
				
			}

		} else {
			// do nothing
			
		}

		return false;
	}

	function isEmail(email){
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
	}

	function calcAge(dateString) {
		dateString = dateString.replace(/-/g, "/");
		var birthday = +new Date(dateString);	
		return ~~((Date.now() - birthday) / (31557600000));

		// var today = new Date();
		// var birthDate = new Date(dateString);
		// var age = today.getFullYear() - birthDate.getFullYear();
		// var m = today.getMonth() - birthDate.getMonth();
		// if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		// age--;
		// }
		// return age;
	};

	setupForm();
	setFormActive(true);

};