angular.module('MetronicApp').controller('reconCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $http, $window,reportService) {
    $scope.companyId = $stateParams.companyId;
    $scope.reconModel = {};
    $scope.monthJSON = [];
    $scope.units=[];
    $scope.units=reportService.getUnits($scope.companyId);
    $scope.getJSON = function() {
        $http.get('js/services/recon.json')
            .then(function(res) {
                $scope.monthJSON = res.data;
                console.log($scope.monthJSON);
            });
    }
    $scope.getJSON();
    $scope.recon = function() {
        console.log('RECON METHOD CALLED',$scope.monthJSON);
        httpService.securePost('api/v1/recon/' + $scope.companyId + "/" + $rootScope.year_,$scope.monthJSON)
            .success(function(res) {
                console.log(res);
                 $state.go('app.viewer', { path: res.doc.file });
            }, function(err) {
                console.log('Error :', err);
            });
    }
    // Date picker
    $scope.chq_date_ = function(i) {
        console.log(i);
        $scope.chq_date.opened = true;
    };

    $scope.dol = function() {
        $scope.popup_dol.opened = true;
    };
    $scope.chq_date = {
        opened: false
    };

    $scope.popup_doj = {
        opened: false
    };
    //Date picker End
});