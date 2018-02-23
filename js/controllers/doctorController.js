angular.module('MetronicApp').controller('doctorController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {

$scope.btnSave=true;
$scope.btnUpdate=false;
$scope.pass=false;
$scope.passname=false;
var doctID;

$scope.dateDoct=function(){
  $scope.popup_date.opened = true;
};
$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];
$scope.popup_date = {
  opened: false
};

var year = new Date().getFullYear();
var range = [];
range.push(year);
for (var i = 1; i <8; i++) {
  range.push(year - i);
}
$scope.years = range;

$scope.degree=function()
{
 httpService.secureGet("doc/secure/getAllDegree/all")
 .success(function(response) {
   $scope.getDegree=response.degrees;
  })
 .error(function(error) {
   SweetAlert.swal("error", "error in getting units", "error")
   console.log(error);
 })
}

$scope.getSpeciality=function(){

 httpService.secureGet("doc/secure/getAllSpeciality/all")
 .success(function(response) {
  $scope.displaySpeciality=response.specialitys;

})
 .error(function(error) {
   SweetAlert.swal("error", "error in getting hospital", "error")
   console.log(error);
 })
}

$scope.postDoctor=function(doctor){
    $scope.doctor.dateofbirth=new Date(doctor.dateofbirth).toISOString();
    httpService.securePost('doc/secure/createDoctor',$scope.doctor)
    .success(function(resp){
      console.log("Added Response=",resp);
      SweetAlert.swal("Added!", "Record added successfully", "success");
           $scope.getDoctorDetails();
           $scope.clear();
        })
    .error(function(error){
      SweetAlert.swal("Error!","error in saving unit","error");
    });
}
$scope.getDoctorDetails=function(){
      httpService.secureGet("doc/secure/getAllDoctor/all")
      .success(function(response) {   
        $scope.data=response.doctors;
        for (var i = 0; i < response.doctors.length; i++) {
          $scope.data[i].dateofbirth=new Date(response.doctors[i].dateofbirth).toISOString().split('T')[0];
        }
         console.log("Doctor dateofbirth======",$scope.data);
         $scope.doctorList=$scope.data;
       })
      .error(function(error) {
       SweetAlert.swal("error", "error in getting units", "error")
       console.log(error);
     })
}

$scope.updateDoctor=function(doctor){
  $scope.doctor.dateofbirth=new Date(doctor.dateofbirth).toISOString();
    httpService.securePut('doc/secure/updateDoctor/'+$rootScope.docID,$scope.doctor)
        .success(function(res) {
            SweetAlert.swal("Success", "Successfully Record Updated", "success");
            $scope.getDoctorDetails();
            $scope.clear();
            $scope.btnSave=true;
            $scope.btnUpdate=false;
            $scope.pass=false;
            $scope.passname=false;
    })
    .error(function(err) {
        console.log(err);
    });
}
$scope.deleteDoctor=function(id){
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

                    httpService.secureDelete('doc/secure/removeDoctor/'+ id)
                    .then(function(response) {
                        SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                        $scope.getDoctorDetails();
                    }, function(error) {
                        alert("Oops! Some problem occured, please try again later");
                    });
                }

            });
}

$scope.editDoctorDetails=function(id){
    $scope.btnSave=false; 
    $scope.btnUpdate=true;
    $scope.pass=true;
    $scope.passname=true;

   httpService.secureGet("doc/secure/getDoctorByID/"+id)
      .success(function(response) {   
      var datelist=new Date(response.doc.dateofbirth).toISOString().split('T')[0];     
             $scope.doctor={
                  address:{
                    building:response.doc.address.building,
                    city:response.doc.address.city,
                    state:response.doc.address.state,
                    street:response.doc.address.street,
                    zipcode:response.doc.address.zipcode
                  },
                  dateofbirth:datelist,
                  email:response.doc.email,
                  gender:response.doc.gender,
                  name:response.doc.name,
                  specialityID:response.doc.specialityID[0],
                  degreeID:response.doc.degreeID,
                  username:response.doc.username,
                  year:response.doc.year
              }
      })
      .error(function(error) {
       SweetAlert.swal("error", "error in getting units", "error")
       console.log(error);
     })
   

}
$scope.clear=function(){
  $scope.doctor="";
}

$scope.refreshNgTable = function() {
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getDoctorDetails();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getDoctorDetails();
        }
    }
$scope.degree();
$scope.getSpeciality();
$scope.getDoctorDetails();

    Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_Doctor'));
});