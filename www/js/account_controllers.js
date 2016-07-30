angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $ionicPopup) {

    $scope.code = [];
    
    $scope.data = [];
    //$scope.data.push("Coletivo");
    
    // When button is clicked, the popup will be shown...
   $scope.showPopup = function() {
      
      // Custom popup
      var myPopup = $ionicPopup.show({
         template:  'Ambiente:'+
                    '<input type = "text" name="code" ng-model = "data.code">'+
                    'Pergunta:'+
                    '<input type = "text" name="desc" ng-model = "data.desc">',
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
                        console.log("/Coletivo_"+$scope.data.code);
                        $scope.mqtt_client.subscribe("/Coletivo_"+$scope.data.code);
                        $scope.data.push("v:opt:"+$scope.data.code+":sim#nao:"+$scope.data.desc);
                        return $scope.data.code;
                     }
                  }
            }
         ]
      });
   };
    
    $scope.edit = function(item) {
        console.log(item);
        message = new Paho.MQTT.Message("fatality");
        message.destinationName = item;
        $scope.mqtt_client.send(message);
        
        $scope.data.splice($scope.data.indexOf(item), 1);
        
    };
});
