angular.module('MetronicApp').controller('patientReportController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
 		

 		$rootScope.doctId=$window.localStorage.getItem("userId");
 		console.log("Doctor ID in Patient Report====",$rootScope.doctId);
 		$scope.doctorId=$rootScope.doctId;

 	$scope.getPatientRepotList=function(){
 		console.log("Local Doctor ID====",$scope.doctorId);
 		httpService.secureGet('doc/secure/getAppointmentForDoctor/'+$scope.doctorId)
 		.success(function(response){
 			console.log("details==================",response.appointments);
 			// console.log("Response for PatientReport=====",response.appointments[0].patientId);
 			  $scope.data = response.appointments;
 			  for (var i = 0; i < response.appointments.length; i++) {
 			  	
 			  		$scope.data[i].date=new Date(response.appointments[i].date).toISOString().split('T')[0];
 			  }
            
            $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            {
                total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var reports = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        reports = params.filter() ? $filter('filter')(reports, params.filter()) : reports;
                        $scope.patienrReportList = reports.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        params.total(reports.length);
                        $defer.resolve( $scope.patienrReportList);
                    }
                });
 		})
 		.error(function(response){
 			SweetAlert.swal({
						title: "Error",
						text: response.message,
						type: "error",
						button: "Ok",
						timer:1000
				})

 		})
 	}

 	$scope.viewFile=function(id){
 		console.log("Patient Appointment ID==",id);
 		httpService.secureGet('doc/secure/getAppointmentByID/'+id)
 		.success(function(response){
 			console.log("Patient Details======",response.doc.fileName);
 			var imagepath=response.doc.fileName;
 			// var showfile='/../uploads/'+imagepath;
 				window.open('http://localhost:8080/uploads/'+ imagepath );

 		})
 		.error(function(response){
 			SweetAlert.swal({
						title: "Error",
						text: response.message,
						type: "error",
						button: "Ok",
						timer:1000
				})

 		})
 	}

 	 $scope.showFilter = false;
    $scope.reportNGTable = function() {
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getPatientRepotList();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getPatientRepotList();
        }
    }
Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_PatientReport'));

	$scope.getPatientRepotList();
});