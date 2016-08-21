angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $ionicPopup, Owned) {
	$scope.channels = Owned.all();

	$scope.showPopup = function() {
		$scope.data = {};

		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-model="data.ambiente">',
    		title: 'Digite o nome do ambiente',
			scope: $scope,

			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Confirma</b>',
				type: 'button-positive',

				onTap: function(e) {
				  if (!$scope.data.ambiente) {
					//don't allow the user to close unless he enters wifi password
					e.preventDefault();
				  } else {
					return $scope.data.ambiente;
				  }
				}
			  }
			]
		});

		myPopup.then(function(res) {
			Owned.add(res);
		});
	}

	$scope.getRoute = function(channel) {
		if (channel.state === "born") return "#/tab/account/form/" + channel.name;
		else return "#/tab/account/" + channel.name;
	}
})

.controller('AccountDetailCtrl', function($scope, $stateParams, $ionicPopup, Owned) {
	$scope.channel = Owned.get($stateParams.accountId);

	$scope.nextState = function () {
		if ($scope.channel.state === "created") {
			var options = "", f = true;

			for (var opt in $scope.channel.options) {
				if (f === false)
					options += "#";

				options += opt;
				f = false;
			}

			message = new Paho.MQTT.Message("v:opt:" + $scope.channel.name + ":" + options + ":" +  $scope.channel.schedule);
			console.log(message.payloadString);
			message.destinationName = "/Coletivo_" + $scope.channel.name;
			$scope.mqtt_client.send(message);
                        
			// vai para 'started'
			Owned.nextState($scope.channel.name);
			console.log($scope.channel.name + " goes to state:" + $scope.channel.state);

	   	} else if ($scope.channel.state === "started") {

			// vai para finished (onde podem ser vistos os resultados)
			Owned.nextState($scope.channel.name);
			console.log($scope.channel.name + " goes to state:" + $scope.channel.state);

			$scope.labels = [];
			$scope.data   = [];

			for (var key in $scope.channel.options) {
				$scope.labels.push(key);
				$scope.data.push($scope.channel.options[key]);
			}

			message = new Paho.MQTT.Message(
				"v:end:" + 
				$scope.channel.name + ":" +
				$scope.labels.join("#") + ":" + 
				$scope.data.join("#")
			);

			// console.log(message.payloadString);
			
			// envia resultados da votação
			message.destinationName = "/Coletivo_" + $scope.channel.name;
			$scope.mqtt_client.send(message);

			console.log($scope.labels);
			console.log($scope.data);
			//$scope.$ionicGoBack();
		} else if ($scope.channel.state === "finished") {
			Owned.nextState($scope.channel.name);	
		}
	}

	$scope.isActive = function (view) {
		switch (view) {
			case 1: return ($scope.channel.state ===  "created") ? "ng-show" : "ng-hide";
			case 2: return ($scope.channel.state ===  "started") ? "ng-show" : "ng-hide";
			case 3: return ($scope.channel.state === "finished") ? "ng-show" : "ng-hide";
		}
	}
})

.controller('AccountFormCtrl', function($scope, $stateParams, Owned) {
	$scope.ambiente = Owned.get($stateParams.accountId).name;

	$scope.options_names = [ "Pergunta", "Opção 1", "Opção 2" ];
	$scope.options       = { "Pergunta": "", "Opção 1":"", "Opção 2":""};

	$scope.addOption = function() {
		var num_opt = $scope.options_names.length;

		$scope.options_names.push("Opções " + num_opt); 
		$scope.options["Opções " + num_opt] = "";	
	}

	$scope.removeOption = function() {
		var num_opt = $scope.options_names.length - 1;

		if (num_opt >= 3) {
			delete $scope.options["Opções " + num_opt];
			$scope.options_names.pop();
		}
	}

	$scope.setChannel = function() {
		var ambiente = $scope.ambiente;
		    pergunta = $scope.options["Pergunta"],
			options  = [];

		for (var key in $scope.options)
			if (key !== "Ambiente" && key !== "Pergunta")
				options.push($scope.options[key]);

		if (ambiente !== "" && pergunta !== "") {
			console.log("/Coletivo_" + ambiente);
			$scope.mqtt_client.subscribe("/Coletivo_" + ambiente);
		}
		
		// cria canal, seta opções e descrição
		Owned.addOptions(ambiente, options.join("#"), pergunta);
		Owned.nextState(ambiente);
	}
});
