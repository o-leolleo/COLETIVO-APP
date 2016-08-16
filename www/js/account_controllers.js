angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $ionicPopup, Owned) {

    $scope.code = [];
    $scope.data = [];
	$scope.channels = Owned.all();
	
   // When button is clicked, the popup will be shown...
   $scope.showPopup = function() {
      
      // Custom popup
      var myPopup = $ionicPopup.show({
         template:  'Ambiente:'+
                    '<input type = "text" name="code" ng-model = "data.code">'+
                    'Pergunta:'+
                    '<input type = "text" name="desc" ng-model = "data.desc">'+
		  			'Opções:<br>'+
                    '1:<input type = "text" name="desc" ng-model = "data.opt1">'+
                    '2:<input type = "text" name="desc" ng-model = "data.opt2">'+
                    '3:<input type = "text" name="desc" ng-model = "data.opt3">',
         title: 'Topico',
         subTitle: 'Digite o nome do ambiente:',
         scope: $scope,
			
         buttons: [
            { text: 'Cancelar' }, {
               text: '<b>Criar</b>',
               type: 'button-positive',
                  onTap: function(e) {
						
                     if (!$scope.data.code || !$scope.data.desc) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
						var res = $scope.data;

                        console.log("/Coletivo_" + res.code);
                        $scope.mqtt_client.subscribe("/Coletivo_" + res.code);
						
						// cria canal, seta opções e descrição
						Owned.add(res.code);
						Owned.addOptions(res.code, res.opt1+"#"+res.opt2+"#"+res.opt3, res.desc);

                        return $scope.data.code;
                     }
                  }
            }
         ]
      });
   };
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
			Owned.remove($scope.channel.name);	
		}
	}

	$scope.isActive = function (view) {
		switch (view) {
			case 1: return ($scope.channel.state ===  "created") ? "ng-show" : "ng-hide";
			case 2: return ($scope.channel.state ===  "started") ? "ng-show" : "ng-hide";
			case 3: return ($scope.channel.state === "finished") ? "ng-show" : "ng-hide";
		}
	}
});
