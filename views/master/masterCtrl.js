angular.module('MetronicApp').controller('masterCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window,modalService) {
    $scope.companyId = $stateParams.companyId;
    $scope.employee = {};
    $scope.saveEmpStatus = true;
    $scope.kycModel = {};
    $scope.kycStatus = false;
    $scope.allEmpolyees = new Object();
    $scope.dob = function() {
        $scope.popup_dob.opened = true;
    };

    $scope.doj = function() {
        $scope.popup_doj.opened = true;
    };
    $scope.dol = function() {
        $scope.popup_dol.opened = true;
    };
    $scope.display = function(){
        $scope.employee.age = $scope.calculateAge($scope.employee.dateOfBirth);
    };
    $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup_dob = {
        opened: false
    };

    $scope.popup_doj = {
        opened: false
    };
    $scope.popup_dol = {
        opened: false
    };

    // getEmployee
    $scope.getEmployeeMaster = function(pfNumber, view) {
            if (pfNumber == null || pfNumber == undefined) {
                console.log("No pfNumber Found!!!");
            } else {
                httpService.secureGet("api/v1/employee/" + pfNumber + "/" + $stateParams.companyId)
                    .success(function(res) {
                        console.log("Get getEmployeeMaster", res.doc);
                        if (view == 'emp') $scope.employee = res.doc;
                        if (view == 'kyc') $scope.kycModel = res.doc;
                        $scope.kycStatus = true;
                        $scope.saveEmpStatus = false;
                        $scope.employee.dateOfBirth = new Date(res.doc.dateOfBirth);
                        $scope.employee.dateOfJoining = new Date(res.doc.dateOfJoining);
                        console.log("res.doc.dateOfLeaving", res.doc.dateOfLeaving);
                        if (res.doc.dateOfLeaving != undefined) $scope.employee.dateOfLeaving = new Date(res.doc.dateOfLeaving);
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            }
        }
        //save employee
    $scope.saveEmployeeMaster = function(pfNumber) {
            console.log($scope.employee, $scope.companyId);
            $scope.employee.companyID = $scope.companyId;
            console.log("Save employee controller",$scope.employee.companyID);
            $scope.employee.age = $scope.calculateAge($scope.employee.dateOfBirth);

            httpService.securePost("api/v1/employee/" + $scope.companyId, $scope.employee)
                .success(function(res) {
                    console.log("response", res);
                    $scope.refresh();
                    SweetAlert.swal("Success", "Employee Saved", 'success');
                })
                .error(function(err) {
                    console.log(err);
                    SweetAlert.swal("Error !", "Error while Saving Employee", 'error');
                });
        }
        // updateEmployee
    $scope.updateEmployeeMaster = function(pfNumber) {
            if (pfNumber == null || pfNumber == undefined) {
                console.log("No pfNumber Found!!!");
            } else {
                httpService.securePut("api/v1/employee/" + $scope.employee._id + "/" + pfNumber, $scope.employee)
                    .success(function(res) {
                        console.log("Get getEmployeeMaster", res.doc);
                        $scope.employee = res.doc;
                        $scope.saveEmpStatus = true;
                        $scope.employee.dateOfBirth = new Date(res.doc.dateOfBirth);
                        $scope.employee.dateOfJoining = new Date(res.doc.dateOfJoining);
                        console.log("res.doc.dateOfLeaving", res.doc.dateOfLeaving);
                        if (res.doc.dateOfLeaving != undefined) $scope.employee.dateOfLeaving = new Date(res.doc.dateOfLeaving);
                        SweetAlert.swal("Success", "Employee Updated", 'success');
                    })
                    .error(function(err) {
                        console.log(err);
                        SweetAlert.swal("Error !", "Error while updating Employee", 'error');
                    })
            }
        }
        // getAllEmployeeMaster    
        // $rootScope.$on('yearChanged', function(event, args) {
        //     $scope.months;
        //     $scope.year = args.newYear;
        //     $scope.pfNumber = '';
        //     $scope.empName = '';
        //     console.log(args);
        //     $scope.getEmployees();
        // });
    $scope.updateEmployee = function($data, id) {
        console.log($data, id);
        httpService.securePut('api/v1/employee/' + id + '/' + $data.pfNumber, $data)
            .success(function(res) {
                console.log(res.doc);
            })
            .error(function(err) {
                console.log(err);
            });
    }
    $scope.getAllEmployeeMaster = function() {
        // console.log("$rootScope.year", $scope.year);
        httpService.secureGet('api/v1/employees/' + $stateParams.companyId)
            .success(function(res) {
                $scope.data = res.docs;
                console.log("list", $scope.data);
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10 // count per page
                }, {
                    total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var users = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        users = params.filter() ? $filter('filter')(users, params.filter()) : users;
                        $scope.allEmpolyees = users.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        params.total(users.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.allEmpolyees);
                    }
                });
            }).error(function(err) {
                console.log(err);
                $scope.allEmpolyees = {};
            });
    }
    $scope.addKYC = function() {
            $scope.kycModel.pfNumber = $scope.employee.pfNumber;
            $scope.kycModel.employeeId = $scope.employee._id;
            console.log($scope.kycModel);
            httpService.securePost("api/v1/addKYCDetails", $scope.kycModel)
                .success(function(res) {
                    console.log(res);
                    SweetAlert.swal("Success", "KYC Details Added Successfuly", "success");
                })
                .error(function(err) {
                    console.log(err);
                    SweetAlert.swal("Opps!", "There is Something wrong or the entry may be exist", "error");
                });
        }
        // Utility
    $scope.refresh = function() {
        $scope.employee = {};
        $scope.saveEmpStatus = true;
    }
    $scope.datePickerConfig = {
        changeYear: true,
        changeMonth: true
    };
    $scope.calculateAge = function(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    

 $scope.exportToExcel = function() {
        console.log("Comapnyid ;", $scope.companyId);
        httpService.secureGet('api/v1/employeeListToExcel/' + $scope.companyId)
            .success(function(res) {
                console.log(res);
                window.location.assign('http://localhost:3000/employeeList.xlsx');
            })
            .error(function(err) {
                console.log(err);
            });
    }
    $scope.callModalService = function(template, size) {
        var template_url = "/views/reports/" + template;
        console.log(template_url, size, $location.port());
        modalService.openModal(template_url, 'reportsCtrl', size);
    }
});