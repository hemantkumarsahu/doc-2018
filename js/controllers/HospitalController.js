angular.module('MetronicApp').controller('HospitalController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
        $scope.getHospital=function(){
        httpService.secureGet("doc/secure/getAllHospital/all")
            .success(function(response) {
                $scope.data = response.hospitals;
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
                console.log("Hospitals value=",$scope.data);
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 5 // count per page
                }, {
                    total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                 

                        var hospital = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;

                        hospital = params.filter() ? $filter('filter')(hospital, params.filter()) : hospital;

                        $scope.allHospitals = hospital.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(hospital.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.allHospitals);
                    }
                });
            })
            .error(function(error) {
                 SweetAlert.swal("error", "error in getting units", "error")
                console.log(error);
            })
        }
    // $rootScope.getunits();
     $scope.deleteHospital = function(hospid) {
        console.log("Delete Hospital=",hospid);
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
                    console.log("After Confirmation=",hospid);

                    httpService.secureDelete('doc/secure/removeHospital/'+ hospid)
                    .then(function(response) {
                        console.log("Deleted Record=",response.data.message);
                        SweetAlert.swal("Deleted!", response.data.message, "success");
                        $scope.getHospital();
                        // $state.reload();
                    }, function(error) {
                        alert("Oops! Some problem occured, please try again later");
                    });
                }

            });
        }

      $scope.saveHospital = function(){
        $scope.host.status='1';
        // console.log("Put Hospital=",host);
        httpService.securePost('doc/secure/createHospital',$scope.host)
            .success(function(resp){
                console.log(resp)
                SweetAlert.swal("Added!", resp.message, "success");
                $scope.getHospital();
            })
            .error(function(error){
                 SweetAlert.swal("error","Something went wrong","error");
            });
    }

    $scope.updateHospital = function($data, id) {
        console.log("Hello Hospital");
        console.log($data,id);
        httpService.securePut('doc/secure/updateHospital/'+id, $data)
        .success(function(res) {
            console.log(res.doc);
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.updateStatusHospital = function(host, id) {
        console.log("Hospital status Details====",host.status);

        if(host.status=='Deactive'){

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
                            $scope.hospitalStatus(host,id);  
                          
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
                $scope.hospitalStatus(host,id);
           }
       
    }
    $scope.hospitalStatus=function(host,id){

         httpService.securePut('doc/secure/updateStatusHospital/'+id,host)
        .success(function(res) {
             $scope.getHospital();
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
            $scope.getHospital();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getHospital();
        }
    }

$scope.getHospital();

})

