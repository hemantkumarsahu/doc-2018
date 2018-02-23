angular.module('MetronicApp').controller('changePasswordCtrl', function($scope, $rootScope, $state, SweetAlert, httpService, $window, $uibModalInstance) {

    $scope.changePass = new Object();
    $scope.changePass.user_id = $rootScope.user.email;

    $scope.changePassword = function() {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Changing Password");

        if ($scope.frmChangePass.$valid) {
            //////// check password & confirm password for equal ///////
            if ($scope.changePass.password == $scope.changePass.confirmPassword) {

                httpService.securePut('secure/changePassword', $scope.changePass).then(function(response) {
                    SweetAlert.swal("Success!", "Password updated successfully", "success");
                    $uibModalInstance.close();
                    console.log("saving data");
                }, function(error) {
                    alert(error.data.message);
                    SweetAlert.swal("Error!", error.data.message, "error");
                    $scope.changePass.currPassword = "";
                })
            } else {
                console.log("validation failed");
                alert("Password & Confirm Password must be same");
                $scope.changePass.password = "";
                $scope.changePass.confirmPassword = "";
            }

        } else {
            console.log("All fields are required....");
            alert("Enter all required fields");
        }

    };
    $scope.cancel = function() {
        console.log("cancelled");
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close();
    };
});
