'use strict';

/**
 * @ngdoc service
 * @name mopaApp.report
 * @description
 * # report
 * Factory in the mopaApp.
 */
angular.module('mopaApp')
  .factory('report', function ($resource, $filter, Mailto, config) {

    var resourceConfig = {
      get: { method: 'GET', isArray: true },
      save: { method: 'POST', isArray: true },
      put: { method: 'PUT', isArray: true }

    };

    var report = $resource(config.API_ROOT + '/requests/:id.json', {},
      resourceConfig);

    /**
     * @description convert a report to email
     * @param  {Object} report current report in the scope
     * @return {String} valid mailto string to bind into href        
     */
    report.toEmail = function (report) {
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
    };

    return report;

  });