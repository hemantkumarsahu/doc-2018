angular.module('MetronicApp').controller('companiesCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {


    $rootScope.getCompanies = function() {
        httpService.get("getCompanies")
            .success(function(companies) {
                $scope.data = companies.companies;
                /*console.log($scope.data)*/
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 5 // count per page
                }, {
                    total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                 

                        var companies = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;

                        companies = params.filter() ? $filter('filter')(companies, params.filter()) : companies;

                        $scope.allCompanies = companies.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(companies.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.allCompanies);



                    }
                });
            })
            .error(function(error) {
                SweetAlert.swal("error", "error in getting companies", "error")
            })
    }
    $rootScope.getCompanies();

});
