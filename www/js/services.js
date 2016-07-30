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
    
})

.factory('Voting', function($rootScope) {
	// armazena vetor de canais inscritos
	var channels = []; 

	return {
		all: function() {
			return channels; 
		}, 

		add: function(name) {
			channels.push({
				name: name,
				vote: true,
				options: [],
				schedule: ""
			});
		},

		addOptions: function(votacao, options, desc) {
			for (var i = 0; i < channels.length; ++i)
				if (channels[i].name === votacao && channels[i].options.length === 0) {
					console.log("adding options: " + options);
					channels[i].options = options.split("#");
					channels[i].schedule = desc;
					return true;
				} else {
					return false;
				}
		},

		remove: function(votacao) {
			console.log(votacao);

			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name == votacao) {
					$rootScope.mqtt_client.unsubscribe(votacao);
					delete channels[i];
					console.log("unsubscribe em Coletivo_" + votacao);
					return true;
				}
				console.log(channels[i].name);
			}
				
			console.log("sem sucesso");
			return false;
		},

		get: function (votacao) {
			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name === votacao)
					return channels[i];
			}

			return null;
		}
	};
});
