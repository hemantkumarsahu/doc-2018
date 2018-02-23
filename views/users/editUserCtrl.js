angular.module('MetronicApp').controller('editUserCtrl', function($scope, $rootScope, $uibModalInstance, $state, SweetAlert, httpService, modalData) {

    $scope.userModel = modalData.user;

    $scope.updateUser = function() {

        if ($scope.editUserForm.$valid) {
            $scope.varUser = "Processing...";

            httpService.securePut('secure/user/' + $scope.userModel._id, $scope.userModel).then(function(response) {
                SweetAlert.swal("Success!", "User updated successfully", "success");
                $uibModalInstance.close();
                $state.reload();
            }, function(error) {
                $scope.varUser = false;
                SweetAlert.swal("Error!", error.data.message, "error");
                alert(error.data.message);
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
