angular.module('MetronicApp').controller('pescriptionController', function($scope, $state, $rootScope,
  SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
       $scope.doctId=$window.localStorage.getItem('userId'); 
    console.log("Doctor Id By Pescription==",$scope.doctId);
  $scope.hidepes=false;
    $scope.showpes=false;
    var temp;
    var data=[];
	$scope.getPescription=function(){

		httpService.secureGet('doc/secure/getAllPescriptionByDoctorID/'+ $scope.doctId)
		 .success(function(response) {
                console.log("Pescription Details=====",response.pescriptions);
                for (var i = 0; i < response.pescriptions.length; i++) {
                     data[i]=response.pescriptions[i].patientId;
                 }
                 console.log("After Getting Data===",data);
                 $scope.list=data;
                 $scope.pesList= _.groupBy($scope.list,"name");
                console.log("Pescription Details Appointment=====",$scope.pesList);
                // console.log("Pescription Details=====",response.pescriptions[0].patientId.name);

                 // $scope.pescritionList=response.pescriptions;
                 
            })
            .error(function(error) {
                 SweetAlert.swal("error", "error in getting units", "error")
                console.log(error);
            })
	}

	$scope.updatepes=function($data,id){

		// console.log("Updated Pescription===",$scope.pes.appointmentId);
		console.log("Updated Pescription===",$data);
		
		console.log("Updated Pescription ID===",id);
		httpService.securePut('doc/secure/updatePescription/'+id,$data)
		 .success(function(response) {
               console.log("Pescription updated response======",response);
               $scope.getPescription();
               SweetAlert.swal('Success',response.message,'success');
                 
            })
            .error(function(error) {
                 SweetAlert.swal("error", "error in getting units", "error")
                console.log(error);
            })


	}

    $scope.updatepesHis=function($data,id,pesid){

        temp=pesid;
        console.log("Updated History data===",$data);
        
        console.log("Updated History  ID===",id);

        httpService.securePut('doc/secure/updatePescription/'+id,$data)
         .success(function(response) {
               console.log("Pescription updated response======",response);
               SweetAlert.swal('Success',response.message,'success');
               $scope.getPescriptionDetails(temp);
                 
            })
            .error(function(error) {
                 SweetAlert.swal("error", "error in getting units", "error")
                console.log(error);
            })



    }

	$scope.deletePescription=function(id){
       
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

                httpService.secureDelete('doc/secure/removePescription/'+id)
                .then(function(response) {
                	console.log("After Deleting Pescription Response",response);
                   
                	 $scope.getPescription();
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                   
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }
        });
	}

    $scope.delpesHistory=function(id,pesid){

        temp=pesid;
        console.log("Getting pescription ID=====",id);
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

                httpService.secureDelete('doc/secure/removePescription/'+id)
                .then(function(response) {
                    console.log("After Deleting Pescription Response",response);
                         $scope.getPescriptionDetails(temp);
                   
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                   
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }
        });

    }
    $scope.getPescriptionDetails=function(pid){
    httpService.secureGet("doc/secure/getAllPescriptionByPatientID/"+ pid)
        .success(function(response) {
            console.log("Pescription Response By ID====",response);  
             console.log("Pescription Response Details====",response.pescriptions);
            $scope.patientHistory=response.pescriptions;
        })
        .error(function(err) {
            console.log(err);
        });
    }

    $scope.viewPescription=function(value){

     
    $scope.hidepes=true;
    $scope.showpes=true;
    $scope.value=value;
    var val=$scope.value[0]._id;
    console.log("Patient ID=========",val);
    httpService.secureGet("doc/secure/getAllPescriptionByPatientID/"+ val)
    .success(function(response) {
            console.log("Pescription Response By ID====",response);  
             console.log("Pescription Response Details====",response.pescriptions);
           console.log("Appontment Date====",response.pescriptions[0].appointmentId.date);
           $scope.data=response.pescriptions;
           for (var i = 0; i < response.pescriptions.length; i++) {
               
                $scope.data[i].appointmentId.date = new Date(response.pescriptions[0].appointmentId.date).toISOString().split('T')[0];

              }


               $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            {
                total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var pescription = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        pescription = params.filter() ? $filter('filter')(pescription, params.filter()) : pescription;
                       $scope.patientHistory = pescription.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        params.total(pescription.length);
                        $defer.resolve($scope.patientHistory);

                    }
                });
               
               
           
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.goback=function(){
        $scope.hidepes=false;
        $scope.showpes=false;

    }

	$scope.getPescription();

Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_pescription'));
});