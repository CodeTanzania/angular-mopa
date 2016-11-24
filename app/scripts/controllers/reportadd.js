'use strict';

/**
 * @ngdoc function
 * @name mopaApp.controller:ReportaddCtrl
 * @description
 * # ReportaddCtrl
 * Controller of the mopaApp
 */
angular.module('mopaApp')
  .controller('ReportaddCtrl', function ($scope, $location, $http, $filter,
    config, report) {
    $scope.newReport = {};
    $scope.serviceCodes = [];
    $scope.serviceCodesAll = [];
    $scope.selectedServiceGroup = '';

    // FIXME: adding dummy coordinates
    $scope.newReport = { lat: -25.933857882269, long: 32.579494714737 };

    /*jshint camelcase:false */
    $http.get(config.API_ROOT + '/services.json', {}).then(function (response) {
      $scope.serviceCodes = response.data;
      $scope.serviceCodesAll = response.data;
    });
    /*jshint camelcase:true */

    $scope.now = function () {
      return new Date().toISOString().split('.')[0] + 'Z';
    };

    $scope.submitReport = function () {
      /*jshint camelcase:false */
      report.save($scope.newReport, function (response) {
        $location.url('/report/' + response[0].service_request_id);
      });
      /*jshint camelcase:true */
    };

    $scope.updateServiceGroup = function () {
      /*jshint camelcase:false */
      $scope.serviceCodes = angular.copy($scope.serviceCodesAll);
      $scope.newReport.service_code = '';
      if ($scope.selectedServiceGroup) {
        $scope.serviceCodes = $filter('filter')($scope.serviceCodesAll, {
          'group': $scope
            .selectedServiceGroup
        });
      }
    };

  });