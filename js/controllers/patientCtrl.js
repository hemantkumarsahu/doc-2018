angular.module('MetronicApp').controller('patientController', function($scope, $state, $rootScope,
  SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
 $scope.date = function() {
  $scope.popup_date.opened = true;
};
$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];
$scope.popup_date = {
  opened: false
};
$scope.getAllPatient = function(){
  console.log("called get Pat");

     httpService.secureGet("doc/secure/getAllPatient/all")
        .success(function(response) {

                $scope.data = response.patients;
                console.log("Patient Date of birth=====",response.patients[0].dateofbirth);
               
                for (var j=0; j<$scope.data.length; j++){

                  $scope.data[j].dateofbirth=new Date(response.patients[j].dateofbirth).toISOString().split('T')[0];
                }

                for(var i=0;i<$scope.data.length;i++){                    
                    if($scope.data[i].status==1)
                    {
                        $scope.data[i].status='Active'
                    }
                    else
                    {
                        $scope.data[i].status='Deactive'
                    }
                }
                $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
                {
                    // total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var patient = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        patient = params.filter() ? $filter('filter')(patient, params.filter()) : patient;
                        $scope.patientList = patient.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    // console.log("data",allHospitals);
                    params.total(patient.length);
                    $defer.resolve($scope.patientList);
                }
            });
            })
        .error(function(error) {
         SweetAlert.swal("error", "error in getting patient", "error")
         console.log(error);
     })
}
$scope.getAllPatient();
$scope.savePatient = function(avai)
{
        $scope.patient.status='1';
        console.log("patient details",$scope.patient);
        httpService.securePost('doc/secure/createPatient',$scope.patient)
        .success(function(response){
          console.log(response);
          SweetAlert.swal("Added!", "Record added successfully", "success");
          $scope.getAllPatient();
          // $scope.getPat();
        })
        .error(function(error){
          SweetAlert.swal("error","error in saving unit","error");
        });
}
$scope.deletePatient = function(Id) {
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

                httpService.secureDelete('doc/secure/removePatient/' + Id).then(function(response) {
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                    $scope.getAllPatient();
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }

        });
  }
  $scope.updatePatient = function($data, id) {
    console.log("$data====================",$data);
    console.log("id",id);
        httpService.securePut('doc/secure/updatePatient/'+id, $data)
        .success(function(res) {
            console.log(res.doc);
            $scope.getAllPatient();
        })
        .error(function(err) {
            console.log(err);
        });
  }
  $scope.updateStatusPatient = function(pat, id) {
    console.log("Updated status of patient====",pat.status);

               if(pat.status=='Deactive'){

                  swal({
                          title: 'Are you sure?',
                          text: 'Do you want to Deactive this Patient?',
                          type: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, Deactivate it!',
                          cancelButtonText: 'No, cancel!',
                          confirmButtonClass: 'confirm-class',
                          cancelButtonClass: 'cancel-class',
                          closeOnConfirm: true,
                          closeOnCancel: false
                        },
                        function(isConfirm) {
                          if (isConfirm) {
                            $scope.deatStatus(pat,id);  
                          
                          } else {
                            swal(
                              'Cancelled',
                              'Your imaginary file is safe :)',
                              'error'
                            );
                          }
                        });

           }
           else{
                $scope.deatStatus(pat,id);
           }

        
    }

    $scope.deatStatus=function(pat,id){

      httpService.securePut('doc/secure/updateStatusPatient/'+id,pat)
        .success(function(res) {
             $scope.getAllPatient();
        })
        .error(function(err) {
            console.log(err);
        });

    }

  $scope.showFilter = false;
    $scope.refreshNgTable = function() {
        
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getAllPatient();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getAllPatient();
        }
  }

// $scope.getAllPatient();


 Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_Patients'));

    });
