<?php
// TODO create your script to use the Withings public API with Oauth2 protocol
?>

<html>

<head>
	<title>Withings Oauth2</title>
	<meta charset="utf-8">
	<link rel="stylesheet" href="index.css">
</head>

<body>
	<h1 class="title">Withings Oauth2</h1>

	<!-- STEP 1 : GET THE DATA (PHP SCRIPT) -->

	<div class="button"><button><a href="https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=a16837aaa8f536b229ce20fa8e90a2739885b640ff67de7b84562b6fe0e27513&redirect_uri=http://localhost:7070&state=withings_test&scope=user.metrics&mode=demo">
				<?php if (isset($_GET["code"])) { // check if the code is in query parameters to change the button
					echo "Retrigger authorization";
				} else echo "Start authorization" ?></a></button></div>

	<?php

	if (isset($_GET["code"])) {
		$code = $_GET["code"]; //get and stock the code from the authorization in the url 

		$ch = curl_init(); //steps here and bottom from the withings doc about oauth2

		curl_setopt($ch, CURLOPT_URL, "https://wbsapi.withings.net/v2/oauth2");

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([ //pass the information about client (in the readme.md + the above $code) in the rigth category
			'action' => 'requesttoken',
			'grant_type' => 'authorization_code',
			'client_id' => 'a16837aaa8f536b229ce20fa8e90a2739885b640ff67de7b84562b6fe0e27513',
			'client_secret' => '881b7dc5686e38894ef0cb27019ebc44e7daf72cc329fe914a43acee15774782',
			'code' => $code,
			'redirect_uri' => 'http://localhost:7070'
		]));

		$rsp = curl_exec($ch); //$rsp send back the access_token needed for the withing's API
		curl_close($ch);

		$rsp_decode = json_decode($rsp, true); //step to transform the $rsp string in $rsp json format (easier to access and transform datas)
		$rsp_acces_code = $rsp_decode["body"]["access_token"]; //retrieve the access token

		curl_setopt($ch, CURLOPT_URL, "https://wbsapi.withings.net/measure"); //step from the withings documentation about API

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			'Authorization: Bearer ' . $rsp_acces_code //put the acces_token in the header
		]);

		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([ //categories 
			'action' => 'getmeas',
			'meastype' => 1, //1 is for weigth according to the withing's documentation
			// 'meastypes' => 'meastypes',
			'category' => 1, //1 is for measures (but not required)
			// 'startdate' => 'startdate', //following are not required according to the documentation
			// 'enddate' => 'enddate',
			// 'offset' => 'offset',
			// 'lastupdate' => 'int'
		]));

		$rsp = curl_exec($ch);
		curl_close($ch);
		$rsp_api_decode = json_decode($rsp, true); //step to transform from string to json
		$rsp_date = $rsp_api_decode["body"]["measuregrps"][0]["date"]; //get the date of the last measure
		$readable_date = date('m/d/Y', $rsp_date); //transform the date to readable date
		$rsp_last_weigth = $rsp_api_decode["body"]["measuregrps"][0]["measures"][0]["value"]; //get the laset weigth
		$unit = $rsp_api_decode["body"]["measuregrps"][0]["measures"][0]["unit"]; //get the last unit
	}
	?>

	<!-- STEP 2 : DISPLAY THE DATA (HTML CSS with php) -->
	<div class="measures">
		<h2>User's last weigth</h2>
		<p>Date : <?php if (isset($_GET["code"])) { //check if the code is retrieved or not
						echo $readable_date; //if so display the data, else nothing
					} else echo ""; ?></p>
		<p>Weigth : <?php if (isset($_GET["code"])) { //check if the code is retrieved or not
						echo number_format($rsp_last_weigth, $unit); //if so display the data, else nothing
					} else echo "" ?> </p>
	</div>
</body>

</html>