'use strict';

/**
* @ngdoc function
* @name mopaApp.controller:AboutCtrl
* @description
* # AboutCtrl
* Controller of the mopaApp
*/
angular.module('mopaApp')
.controller('AboutCtrl', function ($scope, $routeParams, $http, config) {

  $scope.loadStats = function(){
    $http.get(config.API_ROOT + '/stats.json', {}).then(function (response){
      $scope.stats = response.data;
    });
  };
  $scope.loadStats();
});
