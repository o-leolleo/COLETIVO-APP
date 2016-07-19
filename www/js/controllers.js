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

.controller('AccountCtrl', function($scope) {
    
    
    $scope.init = function(config) {
        console.log("/Coletivo_"+config.code);
        $scope.mqtt_client.subscribe("/Coletivo_"+config.code);
        
    };
    
    
    
});
