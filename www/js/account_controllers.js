angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $ionicPopup) {

    $scope.code = [];
    
    $scope.data = [];
    //$scope.data.push("Coletivo");
    
    // When button is clicked, the popup will be shown...
   $scope.showPopup = function() {
      
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" name="code" ng-model = "data.code">',
         title: 'Topico',
         subTitle: 'Digite o nome do ambiente:',
         scope: $scope,
			
         buttons: [
            { text: 'Cancelar' }, {
               text: '<b>Criar</b>',
               type: 'button-positive',
                  onTap: function(e) {
						
                     if (!$scope.data.code) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
                        return $scope.data.code;
                     }
                  }
            }
         ]
      });

      myPopup.then(function(res) {
         console.log("/Coletivo_"+res);
         $scope.mqtt_client.subscribe("/Coletivo_"+res);
         $scope.data.push("/Coletivo_"+res);
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
