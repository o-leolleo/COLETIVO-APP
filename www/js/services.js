angular.module('starter.services', [])

.factory('Chats', function($rootScope) {
    var service = {};
    var client = {};
    
    service.connect = function($Scope) {
        var wsbroker = "iot.eclipse.org";  //mqtt websocket enabled brokers
        var wsport = 80 // port for above
        var client = new Paho.MQTT.Client(wsbroker, wsport,
            "myclientid_" + parseInt(Math.random() * 100, 10));
        client.onConnectionLost = function (responseObject) {
            console.log("connection lost: " + responseObject.errorMessage);
        };
        client.onMessageArrived = function (message) {
            console.log(message.destinationName, ' -- ', message.payloadString);
        };
        var options = {
            timeout: 3,
            onSuccess: function () {
                console.log("mqtt connected");
                
                // Connection succeeded; subscribe to our topic, you can add multile lines of these
                client.subscribe('/Coletivo', {qos: 1});

                //use the below if you want to publish to a topic on connect
                /*message = new Paho.MQTT.Message("Hello");
                message.destinationName = "/World";
                client.send(message);*/

            },
            onFailure: function (message) {
                console.log("Connection failed: " + message.errorMessage);
            }
        };
        client.connect(options);
    };
    
    //return service;
    
    return {
        connect: function(){
            return service;
        }
    }
    
    /*
    service.connect = function(host, port) {
        /*
        var options = {
          username: user,
          password: password
        };
        
        console.log("Try to connect to MQTT Broker " + host + " with user " );
        client = mqtt.createClient(parseInt(port),host);
        //client.subscribe(user+"/#"); 

        client.on('error', function(err) {
            console.log('error!', err);
            client.stream.end();
        });

        client.on('message', function (topic, message) {
          service.callback(topic,message);
        });
    }

    service.publish = function(topic, payload) {
        client.publish(topic,payload, {retain: true});
        console.log('publish-Event sent '+ payload + ' with topic: ' + topic + ' ' + client);
    }

    service.onMessage = function(callback) {
        service.callback = callback;
    }
    */
});
