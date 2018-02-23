angular.module('MetronicApp').controller('availabilityController', function($scope, $state, $rootScope,
  SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
 $scope.date = function() {
  $scope.popup_date.opened = true;
};
$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];
$scope.popup_date = {
  opened: false
};
$scope.getHosp = function(){
  httpService.secureGet("api/v1/getAllHospital")
  .success(function(response) {
    console.log(response);
    $scope.data = response.units;
    console.log("data",$scope.data);
  });
}
$scope.saveAvai = function(avai)
{
        // $scope.avai.status='1';
        console.log("saveAvailability details",avai);
        httpService.securePost('api/v1/addAvailability',avai)
        .success(function(response){
          console.log(response);
          SweetAlert.swal("Added!", "Record added successfully", "success");
          $scope.getAllAvailability();
        })
        .error(function(error){
          SweetAlert.swal("error","error in saving unit","error");
        });
}
$scope.getAllAvailability = function(){
        httpService.secureGet("api/v1/getAllAvailability")
        .success(function(response) {
          console.log(response);
          $scope.availability = response.units;
        })
        .error(function(error) {
         SweetAlert.swal("error", "error in getting hospital", "error")
         console.log(error);
       })
}
 $scope.deleteAvailability = function(Id) {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this record!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!", 
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {

                httpService.secureDelete('api/v1/removeAvailability/' + Id).then(function(response) {
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                    $scope.getHospital();
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }

        });
    }

$scope.getAllAvailability();




    });
