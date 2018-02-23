angular.module('MetronicApp').controller('editCompanyCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {

    console.log($stateParams.isEdit);

    $scope.isEdit = $stateParams.isEdit;
    $scope.companyId = $stateParams.companyId;

    $scope.getOneCompany = function() {
        httpService.get("getOneCompany/" + $scope.companyId)
            .success(function(company) {
                $scope.company = company;
                $scope.companyModel = company.company;
                $rootScope.companyName = company.company.name;
            })
            .error(function(error) {
                console.log(error)
                SweetAlert.swal("error", "error in getting company", 'error')
            })
    }

    $scope.updateCompany = function() {
        //save data and reload the state
        //if isEdit and form.$touched are true then updateCompany API call else $scope.continue();
        if ($scope.isEdit == 'true') {
            console.log($scope.companyModel);
            httpService.securePost("api/v1/updateCompany/" + $scope.companyId, $scope.companyModel)
                .success(function(company) {
                    console.log(company)
                    SweetAlert.swal("Updated!", "Record Updated successfully", "success");
                    $rootScope.companyName = $scope.companyModel.name;
                })
                .error(function(error) {
                    console.log(error)
                    SweetAlert.swal("error", JSON.stringify(error), 'error')
                });
            // $state.reload();

        }
        if ($scope.isEdit == 'false') {
            $rootScope.company = $scope.company;
            $state.go('app.companyDashboard', { companyId: $scope.companyId });
        }
    };
    $scope.addCompany = function() {
        httpService.securePost('api/v1/addCompany', $scope.companyModel)
            .success(function(resp) {
                console.log(resp)
                $state.reload();
            })
            .error(function(error) {
                SweetAlert.swal("error", "error in saving company", "error")
            })
    }
    $scope.getOneCompany();

});