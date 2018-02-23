angular.module('MetronicApp').controller('appointmentController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
 $rootScope.doctID=$window.localStorage.getItem("userId");
	$scope.getPatientName=function(){
		 httpService.secureGet("doc/secure/getAppointmentForDoctor/"+$rootScope.doctID)
            .success(function(response) {
                 console.log("response======appointmentController===============",response);
                 $scope.data=response.appointments;
                 for (var i = 0; i < response.appointments.length; i++) {
                     $scope.data[i].date=new Date(response.appointments[i].date).toISOString().split('T')[0];
                 }

                  // $scope.patientList=$scope.data;
                   $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 5 // count per page
                }, {
                    total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                 

                        var appointment = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;

                        appointment = params.filter() ? $filter('filter')(appointment, params.filter()) : appointment;

                        $scope.patientList = appointment.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(appointment.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.patientList);
                    }
                });


            })
            .error(function(response) {
                 SweetAlert.swal({
                    title:'Sorry',
                    text:'Something went wrong',
                    type:'error',
                    timer:1000
                 })
                console.log(response);
            })
    }
  $scope.getPatientName();
	$scope.updateInfo=function(appoint){
        console.log("appoint====",appoint);
        console.log("date==",appoint.date);
        var d= new Date(appoint.date);
        var day=d.getDay();
        if(day==2){
          appoint
        }
        httpService.securePut('doc/secure/updateAppointment/'+appoint._id, appoint)
        .success(function(res) {
        if(res.status=='success'){
             $scope.getPatientName();
             swal({
              title: "Success",
              text: res.message,
              type: "success",
              button: "Ok",
              timer:1000,
            });

        }
        else if(res.status=='error'){
            swal({
              title: "Sorry",
              text: res.message,
              type: "error",
              button: "Ok",
              timer:1000,
            });
        }
       
        })
        .error(function(err) {
            console.log(err);
        });


    }
    $scope.getConfiguration= function(appoint){
        $rootScope.patientname=appoint.patientId.name;
        $rootScope.patientId=appoint.patientId._id;
        $rootScope.appointmentId=appoint._id;   
        $rootScope.hospitalId=appoint.hospitalId._id  ;
    }
    $scope.saveCheckUp = function(){
        $scope.checkup.patientId = $rootScope.patientId;
        $scope.checkup.appointmentId= $rootScope.appointmentId;
        $scope.checkup.doctorId= $rootScope.doctID;
        $scope.checkup.hospitalId=$rootScope.hospitalId;
        httpService.securePost('doc/secure/createCheckup',$scope.checkup)
         .success(function(resp){
            console.log(resp)
            SweetAlert.swal("Added!", "Record added successfully", "success");
            $scope.clearCheckup();
        })
         .error(function(error){
            SweetAlert.swal("error","error in saving unit","error");
        });
    }

    $scope.saveNote = function(){
        $scope.note.patientId = $rootScope.patientId;
        $scope.note.appointmentId= $rootScope.appointmentId;
        httpService.securePost('doc/secure/createNote',$scope.note)
         .success(function(resp){
            SweetAlert.swal("Added!", "Record added successfully", "success");
            $scope.clearNote();
        })
         .error(function(error){
            SweetAlert.swal("error","error in saving unit","error");
        });
    }
    $scope.savePescription = function(){
        $scope.pes.patientId = $rootScope.patientId;
        $scope.pes.appointmentId= $rootScope.appointmentId;
        $scope.pes.doctorId=$rootScope.doctID;
        $scope.pes.hospitalId=$rootScope.hospitalId;
        httpService.securePost('doc/secure/createPescription',$scope.pes)
         .success(function(resp){
            SweetAlert.swal("Added!", "Record added successfully", "success");
            $scope.clearPescription();
        })
         .error(function(error){
            SweetAlert.swal("error","error in saving unit","error");
        });
    }

    $scope.deletePatientAppointment=function(id){
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
                    console.log("After Confirmation=",id);

                    httpService.secureDelete('doc/secure/removeAppointment/'+ id)
                    .then(function(response) {
                        console.log("Deleted Record=",response);

                        SweetAlert.swal({
                            title:'Success',
                            text: response.message,
                            type:'success',
                            timer:1000
                        });
                        $scope.getPatientName();
                        // $state.reload();

                    }, function(error) {
                        alert("Oops! Some problem occured, please try again later");
                    });
                }

            });

    }
    $scope.clearCheckup=function(){
        $scope.checkup.description="";

    }
     $scope.clearPescription=function(){
        $scope.pes.description="";
        $scope.pes.note="";

    }
    $scope.clearNote=function(){
        $scope.note.description="";
   }
Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_appointment'));
});