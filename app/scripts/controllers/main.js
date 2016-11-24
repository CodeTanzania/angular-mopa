'use strict';

/**
 * @ngdoc function
 * @name mopaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mopaApp
 */
angular.module('mopaApp')
  .controller('MainCtrl', function ($scope, $location, report) {
    var defaults = {
      'reportSearch': { field: 'service_request_id', query: '', limit: 100 }
    };

    $scope.pageStatusMessage = '';
    $scope.reportSearch = angular.copy(defaults.reportSearch);

    $scope.openReport = function (id) {
      $location.path('/report/' + id);
    };

    $scope.update = function () {
      $scope.pageStatusMessage = 'Loading ...';
      var queryParameters = { limit: $scope.reportSearch.limit };
      $scope.reports = [];
      if ($scope.reportSearch.query) {
        queryParameters[$scope.reportSearch.field] = $scope.reportSearch.query;
      }
      report.query(queryParameters, function (data) {
        $scope.reports = data;
        $scope.pageStatusMessage = '';
      }, function () {
        $scope.pageStatusMessage = 'Not Found';
      });
    };
    $scope.update();

    $scope.refresh = function () {
      $scope.reportSearch = angular.copy(defaults.reportSearch);
      $scope.update();
    };
  });