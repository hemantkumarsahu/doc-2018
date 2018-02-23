angular.module('MetronicApp').controller('addUserCtrl', function($scope, $rootScope, $uibModalInstance, $state, SweetAlert, httpService, modalData, $log) {

    $scope.userModel = {};

    $scope.saveUser = function() {

        if ($scope.addUserForm.$valid) {

            $scope.varUser = "Processing...";

            httpService.securePost('secure/user/', $scope.userModel).then(function(response) {
                SweetAlert.swal("Success!", "User added successfully", "success");
                $uibModalInstance.close();
                $state.reload();
            }, function(error) {
                $scope.varUser = false;
                SweetAlert.swal("Error!", error.data.message, "error");
                //SweetAlert.swal("Warning!", error.data.message, "warning");
            });
        } else {
            $scope.varUser = false;
            SweetAlert.swal("Warning!", "Fields are missing", "warning");
        }
    };

    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };

});
