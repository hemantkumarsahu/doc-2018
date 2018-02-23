angular.module('MetronicApp').controller('myProfileCtrl', function($scope, $uibModal, $state, $http, $window, $rootScope, httpService, SweetAlert, $state, $stateParams,uibDateParser) {
    scope = $scope;
    $scope.employee = {};
    $scope.id = $rootScope.user._id;

    $scope.companyId = $stateParams.companyId;
    console.log("id company=",$scope.companyId);

    // Date picker
    $scope.dob = function() {
        $scope.popup_dob.opened = true;
    };

    $scope.doj = function() {
        $scope.popup_doj.opened = true;
    };

    $scope.dol = function() {
        $scope.popup_dol.opened = true;
    };
    $scope.popup_dob = {
        opened: false
    };

    $scope.popup_doj = {
        opened: false
    };
    $scope.popup_dol = {
        opened: false
    };
    // $scope.display = function(){
    //     $scope.employee.age = $scope.calculateAge($scope.employee.dateOfBirth);
    // };
    //Date picker End
    $scope.format="dd-MM-yyyy";
    httpService.secureGet("api/v1/getAllUnit/all/"+$scope.companyId)
            .success(function(units) {
                console.log(units);
                $scope.data = units.units;
            });
    $scope.updateProfile = function() {
        console.log($scope.myProfile);
        if ($scope.myProfileForm.$valid) {
            httpService.putRaterSpot('api/v1/ps/insured/updateProfile/' + $scope.myProfile._id, $scope.myProfile).then(function(response) {
                SweetAlert.swal("Success!", "User Profile updated successfully", "success");

                //update data in session storage as well
                $window.sessionStorage.setItem("user", JSON.stringify($scope.myProfile));
                $state.reload();

            }, function(error) {
                console.log(error);
                alert(error.data.message);
                //alert("Oops! Some problem occured, please try again later\n" + "Error: ");
            });
        } else {
            console.log("validation failed");
            SweetAlert.swal("Warning!", "Enter all required fields", "warning");
        }
    }
    $scope.saveEmployee = function() {
        console.log("Data from this form :", $scope.employee);
        $scope.employee.companyID = $scope.companyId;
        $scope.employee.age = $scope.calculateAge($scope.employee.dateOfBirth);
        httpService.securePost("api/v1/employee/" + $scope.companyId, $scope.employee)
            .success(function(res) {
                console.log("response", res);
                 SweetAlert.swal("Added!", "Record added successfully", "success");
                 $state.reload();
            })
            .error(function(err) {
                console.log(err);
            });
    }

    $scope.calculateAge = function(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
});