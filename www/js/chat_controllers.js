angular.module('starter.controllers')

.controller('ChatsCtrl', function($scope, $ionicPopup, Voting) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //});

	$scope.code   = [];
	$scope.data   = [];
	$scope.chats  = Voting.all();

	$scope.remove = function (channel) {
		$scope.mqtt_client.unsubscribe(channel);
		Voting.remove(channel);
	}

	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: "ERRO",
			template: 'Já se inscreveu nesse ambiente'
	   	});
	}

   $scope.showPopup = function() {
      
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" name="code" ng-model = "data.code">',
         title: 'Votação',
         subTitle: 'Digite o nome da votação:',
         scope: $scope,
			
         buttons: [
            { text: 'Cancelar' }, {
               text: '<b>inscrever-se</b>',
               type: 'button-positive',
                  onTap: function(e) {
						
                     if (!$scope.data.code) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
						 var res = $scope.data.code;
						 
						 // se inscreve na votação
						 console.log("/Coletivo_"+res);
						 $scope.mqtt_client.subscribe("/Coletivo_"+res);

						 if (!Voting.add(res)) {
						     $scope.showAlert();	
							 return null;
						 }

						 // avisa ao juiz 
						 message = new Paho.MQTT.Message("p:new_v:" + res);
						 console.log(message.payloadString);
						 message.destinationName = "/Coletivo_" + res;
						 $scope.mqtt_client.send(message);
						 
						 // vai para waiting
						 Voting.nextState(res);

                     	 return $scope.data.code;
                     }
                  }
            }
         ]
      });
   };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicPopup, Voting) {
	$scope.chat = Voting.get($stateParams.chatId);

	$scope.vote = function (option) {
		if ($scope.chat.state === "voting") {
			var message = new Paho.MQTT.Message("p:vote:" + $scope.chat.name + ":" + option);
			message.destinationName = "/Coletivo_" + $scope.chat.name;
			$scope.mqtt_client.send(message);	

			Voting.nextState($scope.chat.name); // state = "voted"
			$scope.vote = option // salva o voto

			console.log("votou!");
		}
	}

	$scope.showConfirm = function(option) {
	   var confirmPopup = $ionicPopup.confirm({
		 title: option,
		 template: 'tem certeza de que deseja votar nessa opção?'
	   });

	   confirmPopup.then(function(res) {
		 if(res)
			 $scope.vote(option);
	   });
	}

	$scope.end = function() {
		if ($scope.chat.state === "finished") {
			Voting.nextState($scope.chat.name); // vai para created

			 // avisa ao juiz 
			 message = new Paho.MQTT.Message("p:new_v:" + $scope.chat.name);
			 console.log(message.payloadString);
			 message.destinationName = "/Coletivo_" + $scope.chat.name;
			 $scope.mqtt_client.send(message);
			 Voting.nextState($scope.chat.name);
		}
	}

	$scope.isActive = function(view) {
		// abaixo, um belo exemplo de gambiarra
		if ($scope.chat.state === "finished") {
			$scope.labels = $scope.chat.result.labels;
			$scope.data   = $scope.chat.result.data;
		}

		switch (view) {
			case 1: return ($scope.chat.state === "waiting" || $scope.chat.state === "subscribed") ? "ng-show" : "ng-hide";
			case 2: return ($scope.chat.state === "voting")   ? "ng-show" : "ng-hide";
			case 3: return ($scope.chat.state === "voted")    ? "ng-show" : "ng-hide";
			case 4: return ($scope.chat.state === "finished") ? "ng-show" : "ng-hide";
		}
	}
});
