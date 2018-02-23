angular.module('MetronicApp').controller('specilityController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
    
    $scope.getSpecility = function(){
        httpService.secureGet("doc/secure/getAllSpeciality/all")
        .success(function(response) {
            $scope.data = response.specialitys;

            for(var i=0;i<$scope.data.length;i++){                    
                if($scope.data[i].status==1)
                {
                    $scope.data[i].status='Active';
                }
                else
                {
                    $scope.data[i].status='Deactive';
                }
            }
            $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    var specility = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                    specility = params.filter() ? $filter('filter')(specility, params.filter()) : hospital;
                    $scope.specialityHos = specility.slice((params.page() - 1) * params.count(), params.page() * params.count());
                // console.log("data",allHospitals);
                params.total(specility.length);
                $defer.resolve($scope.specialityHos);
                }
                });
        })
        .error(function(error) {
           SweetAlert.swal("error", "error in getting hospital", "error")
           console.log(error);
       })
    }
    $scope.getSpecility();
    $scope.deleteSpecility = function(spId) {
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

                httpService.secureDelete('doc/secure/removeSpeciality/' + Id).then(function(response) {
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                    $scope.getSpecility();
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }
        });
    }
    $scope.addSpec = function(spec)
    {
         $scope.spec.status = '1';
         httpService.securePost('doc/secure/createSpeciality',$scope.spec)
         .success(function(resp){
            console.log(resp)
            SweetAlert.swal("Added!", "Record added successfully", "success");
            $scope.getSpecility();
        })
         .error(function(error){
            SweetAlert.swal("error","error in saving unit","error");
        });
    }
    $scope.updateSpeciality = function($data, id) {
        httpService.securePut('doc/secure/updateSpeciality/'+id, $data)
        .success(function(res) {
            $scope.getSpecility();
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.updateStatusSpeciality = function(spicial, id) {
        console.log("Speciality Status====",spicial.status);


         if(spicial.status=='Deactive'){

                  swal({
                          title: 'Are you sure?',
                          text: 'Do you want to Deactive this Hospital?',
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
                            $scope.spacialityStatus(spicial,id);  
                          
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
                $scope.spacialityStatus(spicial,id);
           }
       
           
    }

    $scope.spacialityStatus=function(spicial,id){

             httpService.securePut('doc/secure/updateStatusSpeciality/'+id,spicial)
                .success(function(res) {
                     $scope.getSpecility();

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
            $scope.getSpecility();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getSpecility();
        }
    }


Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_specility'));

});
