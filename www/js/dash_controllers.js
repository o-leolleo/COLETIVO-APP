angular.module('starter.controllers')

.controller('DashCtrl', function($rootScope) {
})

.controller('DashDetailCtrl', function($rootScope, $stateParams) {
   $scope.name = $stateParams.dashId; 
});
