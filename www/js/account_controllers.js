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
		  			'Opções:'+
                    '<input type = "text" name="desc" ng-model = "data.opt">',
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
						Owned.addOptions(res.code, res.opt.replace(";", "#"), res.desc);

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
		}

		Owned.nextState($scope.channel.name);
		console.log($scope.channel.name + " goes to state:" + $scope.channel.state);
	}

	$scope.isActive = function (view) {
		switch (view) {
			case 1: return ($scope.channel.state ===  "created") ? "ng-show" : "ng-hide";
			case 2: return ($scope.channel.state ===  "started") ? "ng-show" : "ng-hide";
			case 3: return ($scope.channel.state === "finished") ? "ng-show" : "ng-hide";
		}
	}
});
