angular.module('MetronicApp').controller('addCompanyCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {

$scope.addCompany = function(){
	httpService.securePost('api/v1/addCompany',$scope.companyModel)
	.success(function(resp){
		console.log(resp)
         SweetAlert.swal("success", resp.message, "success");
		$state.reload();
	})
	.error(function(error){
		SweetAlert.swal("error","error in saving company","error")
	})
}


});