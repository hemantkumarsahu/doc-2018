angular.module('MetronicApp').controller('registerCtrl', function($rootScope, $scope, httpService, $window, SweetAlert, $state, $log) {

    $log.log("inside registerCtrl:::::::::::::::::::::");

    $scope.doRegister = function() {
        httpService.post("register", $scope.userData)
            .then(function(response) {
                
                $log.log("successful registration");
                $state.go("login");
            }, function(err) {
                SweetAlert.swal("Error!", err.message, "error");
            });
    };

});
