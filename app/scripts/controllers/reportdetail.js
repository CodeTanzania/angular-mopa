'use strict';

/**
* @ngdoc function
* @name mopaApp.controller:ReportdetailCtrl
* @description
* # ReportdetailCtrl
* Controller of the mopaApp
*/
angular.module('mopaApp')
.controller('ReportdetailCtrl', function ($scope, $location, $routeParams, 
  $http, config, report, Mailto) {
  $scope.serviceCodes = [];
  $scope.pageStatusMessage = 'loading ...';

  $http.get(config.API_ROOT + '/services.json', {}).then(function (response){
    $scope.serviceCodes = response.data;
  });

  report.get({id: $routeParams.id}, function(response) {
    $scope.pageStatusMessage = '';
    $scope.report = response[0];
  }, function(response){
    if(response.status === 404) {
      $scope.report = null;
      $scope.pageStatusMessage = 'Report not Found';
    }
  });

  $scope.updateReport = function (){
    $http.put(config.API_ROOT + '/requests/' + $routeParams.id + '.json', $scope.report).then(function (response){
      $scope.pageStatusMessage = 'Report updated.';
    });
  };

  /**
   * @description convert a report to email
   * @param  {Object} report current report in the scope
   * @return {String} valid mailto string to bind into href        
   */
  $scope.toEmail = function(report){

  };
});
