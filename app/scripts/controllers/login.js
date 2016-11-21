'use strict';

/**
 * @ngdoc function
 * @name mopaApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mopaApp
 */

 angular.module('mopaApp')
 .controller('LoginCtrl',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope,
        $location, AuthenticationService) {

        $scope.login = false;

        if(AuthenticationService.LoggedIn()){
            $scope.login = true;
            $location.path('/');
        }

        // reset login status
        AuthenticationService.ClearCredentials();


        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login(
                $scope.username, $scope.password, function(response) {
                if(response.status === 200) {
                    AuthenticationService.SetCredentials(
                    $scope.username, $scope.password);

                    $location.path('/');
                    $scope.login = true;

                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
