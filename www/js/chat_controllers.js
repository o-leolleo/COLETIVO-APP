angular.module('starter.controllers')

.controller('ChatsCtrl', function($scope, $ionicPopup, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

   $scope.chats = Chats.all(); 
   $scope.data  = [];

   $scope.remove = function (votacao) {
	   Chats.remove(votacao);
   }

   $scope.showPopup = function() {
      
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" name="code" ng-model = "data.code">',
         title: 'Votação',
         subTitle: 'Digite o nome da votação:',
         scope: $scope,
			
         buttons: [
            { text: 'Cancelar' }, {
               text: '<b>inscrever-se</b>',
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
         Chats.letMeIn(res);
      });    
   };
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  /*$scope.chat = Chats.get($stateParams.chatId);*/
});
