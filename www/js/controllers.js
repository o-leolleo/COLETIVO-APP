angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Chats) {
    var mqtt_status = localStorage.getItem("mqtt_status");
    console.log("Verifying User Session...");
    console.log('Going to login:');
    Chats.connect();
    /*Chats.connect('test.mosquitto.org', 80);*/
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  /*$scope.chat = Chats.get($stateParams.chatId);*/
})

.controller('AccountCtrl', function($scope) {
    
});
