angular.module('starter.controllers')

.controller('DashCtrl', function($rootScope) {
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
});
