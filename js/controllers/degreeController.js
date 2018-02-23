angular.module('MetronicApp').controller('degreeController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {

	
  $scope.getDegree=function(){
        httpService.secureGet("doc/secure/getAllDegree/all")
            .success(function(response) {
               $scope.data = response.degrees;
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
                
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 5 // count per page
                }, {
                    total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                 

                        var degree = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;

                        degree = params.filter() ? $filter('filter')(degree, params.filter()) : degree;

                        $scope.degreeList = degree.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(degree.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.degreeList);
                    }
                });
            })
            .error(function(error) {
                 SweetAlert.swal("error", "error in getting units", "error")
                console.log(error);
            })
        }

	$scope.addDegree=function(deg){

		 $scope.deg.status='1';
        httpService.securePost('doc/secure/createDegree',$scope.deg)
            .success(function(resp){
                console.log(resp)
                SweetAlert.swal("Added!", resp.message, "success");
                $scope.getDegree();
                // $state.reload();
            })
            .error(function(error){
                 SweetAlert.swal("error","Something went wrong","error");
            })


	}

	 $scope.editDegree = function($data, id) {
       console.log($data,id);
        httpService.securePut('doc/secure/updateDegree/'+id, $data)
        .success(function(res) {
            $scope.getDegree();
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.updateStatusDegree = function(deg, id) {
           if(deg.status=='Deactive'){

                  swal({
                          title: 'Are you sure?',
                          text: 'You want to Deactivate this Degree?',
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
                            $scope.deactiveStatus(deg,id);  
                          
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
                $scope.deactiveStatus(deg,id);
           }

        
    }

    $scope.deactiveStatus=function(deg,id){
        httpService.securePut('doc/secure/updateStatusDegree/'+id,deg)
        .success(function(res) {

             $scope.getDegree();
        })
        .error(function(err) {
            console.log(err);
        });
    }

     $scope.deleteDegree = function(degid) {
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

                    httpService.secureDelete('doc/secure/removeDegree/'+ degid)
                    .then(function(response) {
                        SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                        $scope.getDegree();
                    }, function(error) {
                        alert("Oops! Some problem occured, please try again later");
                    });
                }

            });
        }


	$scope.showFilter = false;
    $scope.refDegreeNgTable = function() {
        
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getDegree();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getDegree();
        }
    }


Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_degree'));

$scope.getDegree();
});