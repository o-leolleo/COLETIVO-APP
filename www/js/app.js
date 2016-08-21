// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'chart.js', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, Voting, Owned) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
        // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    //==========================================================================
    // Create a client instance
    $rootScope.mqtt_client = new Paho.MQTT.Client("test.mosquitto.org", 8080, 
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
		message = message.payloadString.split(":");

		if (message[0] === "v") {
			if (message[1] === "opt") {
				console.log(message[2]);

				if (Voting.get(message[2]) !== null && Voting.get(message[2]).state === "waiting") {
								  /* votacao,    options, description*/
					Voting.addOptions(message[2], message[3], message[4]);
					Voting.nextState(message[2]); // state = "voting"
				}
			} else if (message[1] === "end") {
								  /* votacao,    labels,      data */
				Voting.addResults(message[2], message[3], message[4]);			
				Voting.nextState(message[2]);
			}
		} else if (message[0] === "p") {
			if (message[1] === "new_v") {
				var channel = Owned.get(message[2]); 

				if (channel !== null && channel.state === "started") {
					var options = "", f = true;

					for (var opt in channel.options) {
						if (f === false)
							options += "#";

						options += opt;
						f = false;
					}

					message = new Paho.MQTT.Message("v:opt:" + channel.name + ":" + options + ":" +  channel.schedule);
					console.log(message.payloadString);
					message.destinationName = "/Coletivo_" + channel.name;
					$rootScope.mqtt_client.send(message);
				}
			} else if (message[1] === "vote") {
				var channel = Owned.get(message[2]);

				if (channel.state === "started")
					channel.options[message[3]]++;			
			}
		}
    }
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.dash-detail', {
      url: '/dash/:dashId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/dash-detail.html',
          controller: 'DashDetailCtrl'
        }
      }
    })
  
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.account-form', {
	url: '/account/form',
	views: {
		'tab-account': {
			templateUrl: 'templates/account-form.html',
			controller: 'AccountFormCtrl'
		}
	}
  })

  .state('tab.account-detail', {
	url: '/account/:accountId',
  	views: {
		'tab-account': {
			templateUrl: 'templates/account-detail.html',
  			controller: 'AccountDetailCtrl'
		}
	}
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

