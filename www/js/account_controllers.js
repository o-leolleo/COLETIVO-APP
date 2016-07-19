angular.module('starter.controllers')

.controller('AccountCtrl', function($scope) {

    $scope.init = function(config) {
        console.log("/Coletivo_"+config.code);
        $scope.mqtt_client.subscribe("/Coletivo_"+config.code);
        
    };
});
