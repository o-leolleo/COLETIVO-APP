angular.module('starter.services', [])

.factory('Dash', function($rootScope) {
    var service = {};
    var client = {};

    /*
    service.subscribe = function(config)
    {
        console.log("Init:" + config.time + config.code);
        client.subscribe('/'+config.code, {qos: 1});
    };
    
    service.connect = function() {
        var wsbroker = "broker.hivemq.com";  //mqtt websocket enabled brokers
        var wsport   = 8000 // port for above
        var client   = new Paho.MQTT.Client(wsbroker, wsport,
            "myclientid_" + parseInt(Math.random() * 100, 10));

        client.onConnectionLost = function (responseObject) {
            console.log("connection lost: " + responseObject.errorMessage);
        };

        client.onMessageArrived = function (message) {
            console.log(message.destinationName, ' -- ', message.payloadString);
        };

        var options = {
            timeout: 3,

			userName: "admin",
			password: "",

            onSuccess: function () {
                console.log("mqtt connected");
                
                // Connection succeeded; subscribe to our topic, you can add multile lines of these
                //client.subscribe('/Coletivo', {qos: 1});

                //use the below if you want to publish to a topic on connect
                /*message = new Paho.MQTT.Message("Hello");
                message.destinationName = "/World";
                client.send(message);
            },

            onFailure: function (message) {
                console.log("Connection failed: " + message.errorMessage);
            }
        };

        client.connect(options);
    };
    
    return {
        connect: function(){
            return service;
        }
    };
    */
    
});
