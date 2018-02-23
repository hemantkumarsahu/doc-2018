angular.module('MetronicApp').controller('checkupCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
   $scope.doctId=$window.localStorage.getItem('userId'); 
   console.log("Doctor ID======",$scope.doctId);
   
    $scope.checkUpDetails=false;
    $scope.showHistory=false;
    var paid;
    $scope.getCheckUp = function(){
        console.log("called getCheckUp");
        httpService.secureGet("doc/secure/getAllCheckupByDoctorID/"+$scope.doctId)
        .success(function(response) {
            var data=[];
            console.log("response",response.checkups);
            for (var i = 0; i < response.checkups.length; i++) {
                data[i]=response.checkups[i].patientId;
            }
            console.log("$scope.data patient Name====",data);
            // $scope.data = $filter('default')($filter('name')(data),'value available');
            $scope.list=data;
            $scope.checkupList=_.groupBy($scope.list,"name");
            console.log("After Grouping Data====",$scope.checkupList);

            // $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            // {
            //     total: $scope.data.length, // length of data
            //         getData: function($defer, params) {
            //             var checkup = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
            //             checkup = params.filter() ? $filter('filter')(checkup, params.filter()) : checkup;
            //             $scope.checkupList = checkup.slice((params.page() - 1) * params.count(), params.page() * params.count());
            //             params.total(checkup.length);
            //             $defer.resolve($scope.checkupList);
            //         }
            //     });
        })
        .error(function(error) {
           SweetAlert.swal("error", "error in getting checkup", "error")
           console.log(error);
       })
    }
    $scope.getCheckUp();
    $scope.deleteCheckUp = function(id) {
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

                httpService.secureDelete('doc/secure/removeCheckup/'+id).then(function(response) {
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                    $scope.getCheckUp();
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }
        });
    }
    
    $scope.deleteHis=function(id,pid){

        console.log("Patient ID====",pid);
        console.log("Checkup ID====",id);
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

                httpService.secureDelete('doc/secure/removeCheckup/'+id).then(function(response) {
                    
                    $scope.getEditData(pid);
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                    
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }
        });

    }

     $scope.editCheckUp = function($data, id) {

        
        console.log("Checkup ID====",id);
        console.log("edit checkup==================",$data);
        httpService.securePut('doc/secure/updateCheckup/'+id, $data)
        .success(function(res) {
            $scope.getCheckUp();
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.editHis=function($data,id,pid){

        console.log("Patient ID====",pid);
        console.log("Checkup ID====",id);
          console.log("edit checkup==================",$data,id);
        httpService.securePut('doc/secure/updateCheckup/'+id, $data)
        .success(function(res) {
            $scope.getEditData(pid);
            
        })
        .error(function(err) {
            console.log(err);
        });
    }

    $scope.getEditData=function(pid){

        console.log("After Getting Patient ID===",pid);

         httpService.secureGet('doc/secure/getAllCheckupByPatientID/'+ pid)
           .success(function(response){
                console.log("After Editing response=====",response.checkups);
                $scope.data = response.checkups;
            
            $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            {
                total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var checkup = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        checkup = params.filter() ? $filter('filter')(checkup, params.filter()) : checkup;
                        $scope.checkupHistory = checkup.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        params.total(checkup.length);
                        $defer.resolve($scope.checkupHistory);

                    }
                });

           }).error(function(response){
                SweetAlert.swal({
                    title:'Sorry!',
                    text:'Something went Wrong',
                    type:'warning',
                    timer:1000
                })

           })
    }


    $scope.showFilter = false;
    $scope.refreshNgTable = function() {
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getCheckUp();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getCheckUp();
        }
    }
 $scope.viewHistory=function(value){
    $scope.checkUpDetails=true;
    $scope.showHistory=true;
    console.log("View Values=====",value);
    $scope.value=value;
    console.log("View Patient ID=====",$scope.value[0]._id);
    paid=$scope.value[0]._id;

    // console.log("doctor id=========",id);
    httpService.secureGet("doc/secure/getAllCheckupByPatientID/"+paid)

    .success(function(res) {
            console.log("viewHistory====",res.checkups);
            console.log("Appontments Date====",res.checkups[0].appointmentId.date);

                $scope.data = res.checkups;
                for (var i = 0; i < res.checkups.length; i++) {
                    $scope.data[i].appointmentId.date=new Date(res.checkups[i].appointmentId.date).toISOString().split('T')[0];
                }

                console.log("$scope.data=====",$scope.data);
               
            
            $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            {
                total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var checkup = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        checkup = params.filter() ? $filter('filter')(checkup, params.filter()) : checkup;
                        $scope.checkupHistory = checkup.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        params.total(checkup.length);
                        $defer.resolve($scope.checkupHistory);

                    }
                });
        })
        .error(function(err) {
            SweetAlert.swal({
                    title:'Sorry!',
                    text:'Something went Wrong',
                    type:'error',
                    timer:1000
            })
        });
 }
$scope.getBack=function(){
    $scope.checkUpDetails=false;
    $scope.showHistory=false;
}

Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_checkUp'));

})        
