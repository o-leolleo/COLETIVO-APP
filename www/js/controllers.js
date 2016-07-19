angular.module('starter.controllers', [])

.controller('DashCtrl', function($rootScope) {
    /*var mqtt_status = localStorage.getItem("mqtt_status");
    console.log("Verifying User Session...");
    console.log('Going to login:');
	session = Chats.connect();
	session.connect();
    Chats.connect('test.mosquitto.org', 80);*/
    
    //==========================================================================
    // Create a client instance
    $rootScope.mqtt_client = new Paho.MQTT.Client("iot.eclipse.org", 80, 
                                                  "myclientid_" + parseInt(Math.random() * 100, 10));
    
    // set callback handlers
    $rootScope.mqtt_client.onConnectionLost = onConnectionLost;
    $rootScope.mqtt_client.onMessageArrived = onMessageArrived;

    // connect the client
    $rootScope.mqtt_client.connect({onSuccess:onConnect});
    
    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        $rootScope.mqtt_client.subscribe("/Coletivo");
        /*message = new Paho.MQTT.Message("Hello");
        message.destinationName = "/Coletivo";
        $rootScope.mqtt_client.send(message);*/
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
    }
})

.controller('ChatsCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
  
})


.controller('ChatDetailCtrl', function($scope, $stateParams) {
  /*$scope.chat = Chats.get($stateParams.chatId);*/
})

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
