angular.module('MetronicApp').controller('reportsCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModalInstance, $http, $window, reportService) {
    $scope.companyId = $stateParams.companyId;
    //Boolean Vars
    $scope.selectedMonthBoolean = true;
    $scope.toggleMonth = function(boolVal) {
        console.log(boolVal);
        $scope.selectedMonthBoolean = boolVal;
    }


    //Boolean Vars Ends
    console.log("Inside the reports controller", $scope.companyId);
    $scope.close = function() {
        $uibModalInstance.close();
    }
    $scope.exportToExcelEmpInfo = function() {
        console.log("Comapnyid ;", $scope.companyId);
        console.log("Year ;", $rootScope.year);
        httpService.secureGet('api/v1/employeeInfo/' + $scope.companyId)
            .success(function(res) {
                console.log(res);
                // window.location.assign('http://localhost:3000/foo.xlsx');
            })
            .error(function(err) {
                console.log(err);
            });
    }

    $scope.form5Model = {};
    $scope.form5Model.outputCriteria = 'monthWise';
    $scope.form5 = function() {
        console.log($scope.form5Model);
        if ($scope.form5Model.outputCriteria == 'monthWise') {
            httpService.secureGet('api/v1/form5/' + $scope.companyId + "/" + $scope.form5Model.selectedMonth + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.doc.file) {
                        $uibModalInstance.close();
                        $state.go('app.viewer', { path: res.doc.file });
                    }
                });
        }
        if ($scope.form5Model.outputCriteria == 'pfNoWise') {
            if ($scope.form5Model.start && $scope.form5Model.end) {
                httpService.secureGet('api/v1/form5pfwise/' + $scope.companyId + "/" + $scope.form5Model.start + "/" + $scope.form5Model.end + "/" + $rootScope.year_)
                    .success(function(res) {
                        console.log(res);
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    });
            } else { SweetAlert('Warning', 'there may be wrong request', 'warning') }
        }
    }
    $scope.form10Model = {};
    $scope.form10Model.outputCriteria = 'monthWise';
    $scope.form10 = function() {
        console.log($scope.form10Model);
        if ($scope.form10Model.outputCriteria == 'monthWise') {
            httpService.secureGet('api/v1/form10/' + $scope.companyId + "/" + $scope.form10Model.selectedMonth + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                });
        } else if ($scope.form10Model.outputCriteria == 'pfNoWise') {
            httpService.secureGet('api/v1/form10pfwise/' + $scope.companyId + "/" + $scope.form10Model.start + "/" + $scope.form10Model.end + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                });
        } else { SweetAlert.swal('Warning', 'there may be wrong request', 'warning') }
    }
    $scope.form4psModel = {};
    $scope.form4psModel.outputCriteria = 'monthWise';
    $scope.form4ps = function() {
        console.log($scope.form4psModel);
        if ($scope.form4psModel.outputCriteria == 'monthWise') {

            httpService.secureGet('api/v1/form4Ps/' + $scope.companyId + "/" + $scope.form4psModel.selectedMonth + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                });
        } else if ($scope.form4psModel.outputCriteria == 'pfNoWise') {
            httpService.secureGet('api/v1/form4Pspfwise/' + $scope.companyId + "/" + $scope.form4psModel.start + "/" + $scope.form4psModel.end + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                });
        } else { SweetAlert.swal('Warning', 'there may be wrong request', 'warning') }
    }
    $scope.form5psModel = {};
    $scope.form5psModel.outputCriteria = 'monthWise';
    $scope.form5ps = function() {
        console.log($scope.form5psModel);
        if ($scope.form5psModel.outputCriteria == 'monthWise') {

            httpService.secureGet('api/v1/form5Ps/' + $scope.companyId + "/" + $scope.form5psModel.selectedMonth + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                });
        } else if ($scope.form5psModel.outputCriteria == 'pfNoWise') {
            httpService.secureGet('api/v1/form5Pspfwise/' + $scope.companyId + "/" + $scope.form5psModel.start + "/" + $scope.form5psModel.end + "/" + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                });
        } else { SweetAlert.swal('Warning', 'there may be wrong request', 'warning') }
    }

    $scope.outputCriteria = "screen";
    $scope.selectedMonth = 1;
    $scope.monthlyUnitWise = function(outputType, selectedMonth) {
        console.log($rootScope.year_, outputType, selectedMonth);
        httpService.secureGet('api/v1/monthlyUnitWise/' + $scope.companyId + "/" + selectedMonth + "/" + $rootScope.year_)
            .success(function(res) {
                console.log(res);
            });
    }
    //Challan
    $scope.month;
    $scope.selectedUnit;
    httpService.secureGet("api/v1/getAllUnit/all/"+$scope.companyId)
            .success(function(units) {
                console.log(units);
                $scope.data = units.units;
            });
    $scope.challan = function() {
        console.log("Select unit",$scope.selectedUnit);
        httpService.secureGet('api/v1/challan/' + $scope.companyId + "/" + $scope.month + "/" + $rootScope.year_ + "/" + $scope.selectedUnit)
            .success(function(res) {
                    if (res.message != 'NRF') {
                        if (res.doc.file) {
                            $uibModalInstance.close();
                            $state.go('app.viewer', { path: res.doc.file });
                        }
                    } else {
                        $uibModalInstance.close();
                        SweetAlert.swal('No Record Found');
                    }
                },
                function(err) {
                    console.log('Error :', err);
                })
    }

    //form9
    $scope.form9Model = {};
    $scope.form9Model.continueous = true;
    $scope.form9 = function() {
        console.log($scope.form9Model);
        if ($scope.form9Model.continueous) {
            httpService.secureGet('api/v1/form9/' + $scope.companyId + '/' + $rootScope.year_)
                .success(function(res) {
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
        } else {
            httpService.secureGet('api/v1/form9/' + $scope.companyId + '/' + $rootScope.year_+'/'+$scope.form9Model.start+'/'+$scope.form9Model.end)
                .success(function(res) {
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
        }
    }

    //form3ps
    $scope.form3psModel = {};
    $scope.form3psModel.continueous = true;
    $scope.form3ps = function() {
        console.log($scope.form3psModel);
        if ($scope.form3psModel.continueous) {
            httpService.secureGet('api/v1/form3ps/' + $scope.companyId + '/' + $rootScope.year_)
                .success(function(res) {
                    console.log(res);
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
        } else {
            httpService.secureGet('api/v1/form3ps/' + $scope.companyId + '/' + $rootScope.year_ + '/' + $scope.form3psModel.start + '/' + $scope.form3psModel.end)
                .success(function(res) {
                    console.log("form 3ps res content",res);
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
        }
    }

    //form7ps
    $scope.form7psModel = {};
    $scope.form7psModel.continueous = true;
    $scope.form7ps = function() {
        console.log($scope.form7psModel);
        if ($scope.form7psModel.continueous) {
            httpService.secureGet('api/v1/form7Ps/' + $scope.companyId + '/' + $rootScope.year_)
                .success(function(res) {
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
        } else {
            httpService.secureGet('api/v1/form7Ps/' + $scope.companyId + '/' + $rootScope.year_ + '/' + $scope.form7psModel.start + '/' + $scope.form7psModel.end)
                .success(function(res) {
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
        }
    }

    //monthly Summary
    $scope.monthlySummaryModel = {};
    $scope.monthlySummary = function() {
        console.log($scope.monthlySummaryModel);
        httpService.secureGet('api/v1/monthlySummary/' + $scope.companyId + '/' + $scope.monthlySummaryModel.selectedMonth + "/" + $rootScope.year_)
            .success(function(res) {
                window.location.assign(BASE_URL + res.file);
            }, function(err) {
                console.log(err);
            });
    }

    //unitWiseMonthlySumm information
    $scope.unitWiseMonthlySummModel = {};
    $scope.unitWiseMonthlySumm = function() {
        console.log($scope.unitWiseMonthlySummModel);
        httpService.secureGet('api/v1/monthlyUnitWise/' + $scope.companyId + '/' + $scope.unitWiseMonthlySummModel.selectedMonth + '/' + $rootScope.year_)
            // .success(function(res) {
            //     console.log(res);
            // }, function(err) {
            //     console.log(err);
            // });
            .success(function(res) {
                    console.log(res);
                    $uibModalInstance.close();
                    $state.go('app.viewer', { path: res.data.file });
                }, function(err) {
                    console.log(err);
                });
    }
    //yearlySummarryModel
    $scope.yearlySummarryModel = {};
    $scope.yearlySummarry = function() {
        console.log($scope.yearlySummarryModel);
        httpService.secureGet('api/v1/yearlySummary/' + $scope.companyId + "/" + $rootScope.year_)
            .success(function(res) {
                console.log(res);
                window.location.assign(BASE_URL+res.doc.file);
            }, function(err) {
                console.log(err);
            });
    }
    $scope.importNewRegistationHash = function() {
        reportService.importNewRegistationHash($scope.companyId, $rootScope.year_);
    }
});