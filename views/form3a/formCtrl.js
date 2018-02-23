angular.module('MetronicApp').controller('formCtrl', function ($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
    $scope.companyId = $stateParams.companyId;
    $scope.form3aModel = {};
    $scope.selectedPfModel = [];
    $scope.selectedPf = false;
    $scope.form3aModel.pfrange = true;
    $scope.addButton = true;
    $scope.pdfUrl = '';
    $scope.showForm6a = false;
    $scope.orderBy = 'pfNumber';
    $scope.names4Selection;
    $scope.pfNumber;
    $scope.checkbox1 = function () {
        console.log($scope.form3aModel);
        if ($scope.form3aModel.pfrange) {
            $scope.selectedPf = false;
            $scope.form3aModel.Selected = false;
            $scope.addButton = true;
        }
    }
    // =====================================================
    $rootScope.$on('yearChanged', function (event, args) {
        $rootScope.year_ = args.newYear;
        console.log("Year", ($rootScope.year_ - 1) + "-" + $rootScope.year_);
    });
    // =====================================================
    $scope.checkbox2 = function () {
        console.log($scope.form3aModel);
        if ($scope.form3aModel.Selected) {
            $scope.selectedPf = true;
            $scope.form3aModel.pfrange = false;
            $scope.addButton = false;
        }
    }
    // $scope.selectPfAndAdd = function () {
    //     $scope.inserted = {
    //         id: $scope.selectedPfModel.length + 1,
    //         pfNumber: '',
    //         name: '',
    //     };
    //     $scope.selectedPfModel.push($scope.inserted);
    // };
    $scope.generateReportForm3a = function () {
        console.log($scope.form3aModel);
        console.log($scope.selectedPfModel, $scope.form3aModel.pfrange);
        if ($scope.form3aModel.pfrange) {
            var start = $scope.form3aModel.start;
            console.log("start date",start);
            var end = $scope.form3aModel.end;
            console.log("End Date",end);
            console.log("companyId",$scope.companyId);
            console.log("year",$rootScope.year_);
            httpService.secureGet('api/v1/form3a_range/' + start + "/" + end + "/" + $rootScope.year_ + "/" + $scope.companyId)
                .success(function (res) {
                    $scope.pdfUrl = res.url;
                    console.log(res, $scope.pdfUrl);
                    $state.go('app.form3aView');
                })
                .error(function (err) {
                    console.log(err);
                });
        }
        if ($scope.form3aModel.Selected) {
            console.log('$scope.form3aModel.Selected', $scope.form3aModel.Selected);
            console.log('$scope.selectedPfModel', $scope.selectedPfModel);
            httpService.securePost('api/v1/form3a_selected/' + $scope.companyId + "/" + $rootScope.year_,$scope.selectedPfModel)
                .success(function (res) {
                    console.log(res);
                    $state.go('app.form3aView');
                })
                .error(function (err) {
                    console.log(err);
                });
        }

    };
    $scope.getEmployee = function (data, id) {
        console.log(data);
        if (pfNumber == null || pfNumber == undefined) {
            console.log("No pfNumber Found!!!");
        } else {
            httpService.secureGet("api/v1/employee/" + pfNumber + "/" + $stateParams.companyId)
                .success(function (res) {
                    console.log("Get getEmployeeMaster", res.doc);
                })
                .error(function (err) {
                    console.log(err);
                })
        }
    }
    $scope.letsHaveForm6a = function (orderBy) {
        console.log(orderBy);
        httpService.secureGet('api/v1/form6a/' + orderBy + "/" + $rootScope.year_ + "/" + $scope.companyId)
            .success(function (res) {
                console.log(res);
                $state.go('app.form6aView');
            })
            .error(function (err) {
                console.log(err);
            });
    }
    $scope.getEmployeeForTypeahead = function () {
        httpService.secureGet('api/v1/typeahead/' + $scope.companyId)
            .success(function (res) {
                console.log(res);
                $scope.names4Selection = res.doc;
            })
            .error(function (err) {
                console.log(err);
            });
    }
    $scope.getEmployeeForTypeahead();
    $scope.addSelectedPf = function (pfNumber) {
        var checkExistance = $filter('filter')($scope.selectedPfModel, function (d) { if (d.pfNumber === pfNumber) return true; else return false; });
        console.log(checkExistance);
        if (!checkExistance.length) {
            var name = $filter('filter')($scope.names4Selection, function (d) { if (d.pfNumber === pfNumber) return d.name; })[0].name;
            console.log("pfNumber,name", pfNumber, name);
            $scope.inserted = {
                id: $scope.selectedPfModel.length + 1,
                pfNumber: pfNumber,
                name: name,
            };
            $scope.selectedPfModel.push($scope.inserted);
        } else {
            SweetAlert.swal('Already Selected', '', 'info');
        }
    }
    $scope.deleteSelectedPf = function (index) {
        console.log($scope.selectedPfModel.splice(index, 1));
    }
});