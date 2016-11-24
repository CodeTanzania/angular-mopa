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
    $http, $filter, config, report, Mailto) {
    $scope.serviceCodes = [];
    $scope.pageStatusMessage = 'loading ...';

    $http.get(config.API_ROOT + '/services.json', {}).then(function (response) {
      $scope.serviceCodes = response.data;
    });

    report.get({ id: $routeParams.id }, function (response) {
      $scope.pageStatusMessage = '';
      $scope.report = response[0];
      //convert report to email
      $scope.mailTo = toEmail($scope.report);
    }, function (response) {
      if (response.status === 404) {
        $scope.report = null;
        $scope.pageStatusMessage = 'Report not Found';
      }
    });

    $scope.updateReport = function () {
      /*jshint camelcase:false */
      $http.put(config.API_ROOT + '/requests/' + $routeParams.id + '.json',
        $scope.report).then(function ( /*response*/ ) {
        $scope.pageStatusMessage = 'Report updated.';
      });
      /*jshint camelcase:true */
    };

    /**
     * @description convert a report to email
     * @param  {Object} report current report in the scope
     * @return {String} valid mailto string to bind into href        
     */
    function toEmail(report) {
      /*jshint camelcase:false */

      //prepare compaint address
      var address = '';
      if (report.account_number) {
        address = address + report.account_number;
      }
      if (report.address) {
        if (address) {
          address = address + '/' + report.address;
        } else {
          address = address + report.address;
        }
      }

      var time = 'N/A';
      var date = 'N/A';
      try {
        time = $filter('date')(report.call_start_time, 'hh:mm:ss a');
        date = $filter('date')(report.call_start_time, 'dd/MM/yyyy');
      } catch (error) {}

      //prepare e-mail body
      var body = [
        'Hello,',
        '\n\n',
        'Please assist in resolving customer complaint #',
        report.service_request_id || 'N/A',
        '.',
        '\n\n',
        'Time: ',
        time || 'N/A',
        '\n',
        'Date: ',
        date || 'N/A',
        '\n',
        'Account Number/Location: ',
        address || 'N/A',
        '\n',
        'Area: ',
        report.agency_responsible || 'N/A',
        '\n',
        'Customer Name: ',
        report.name || 'N/A',
        '\n',
        'Phone No.: ',
        report.phone || 'N/A',
        '\n',
        'Nature of Complaint: ',
        report.service_name || 'N/A',
        '\n',
        'Complaint Details: ',
        report.description || 'N/A',
        '\n\n',
        'Regards.'
      ].join('');

      //prepare e-mail send option
      var recipient = '';
      var options = {
        subject: report.service_name,
        body: body
      };
      /*jshint camelcase:true*/

      var href = Mailto.url(recipient, options);

      return href;
    }

  });