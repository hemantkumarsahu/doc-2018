angular.module('MetronicApp').controller('companyDashboardCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window, modalService, reportService) {
    $scope.total = {};
    $scope.monthlyPfModel = {};
    $scope.employeeFound = false;
    $scope.cfilter = {};
    $scope.fullMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();
    console.log($location.absUrl());
    $scope.clear = function() {
        $scope.dt = null;
    };
     $scope.companyId = $stateParams.companyId;
     console.log("please Check",$scope.companyId);
     httpService.secureGet("api/v1/getAllUnit/all/"+ $scope.companyId)
            .success(function(units) {
                console.log(units);
                $scope.data = units.units;
                // console.log($scope.data);

            });

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
    }, {
        date: afterTomorrow,
        status: 'partially'
    }];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }


    $rootScope.companyId = $stateParams.companyId;
    $scope.pfNumber = '';
    $scope.monthlyPfModel = {};
    $scope.months = [];
    $scope.monthsArray = [];
    // ===================================================Get Employees====================================================
   
    $scope.getEmployees = function() {
        console.log("companyId:::", $rootScope.companyId);
        //    api/v1/getAllEmployeesForList/

        httpService.secureGet('api/v1/getAllEmployeesForList/' + $rootScope.companyId + '/' + $scope.year).success(function(res) {
            $scope.data = res.docs;
            console.log("list", res);
            $scope.totalCountList($scope.data);
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10 // count per page
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    var users = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                    users = params.filter() ? $filter('filter')(users, params.filter()) : users;
                    $scope.allusers = users.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(users.length);
                    // set total for recalc pagination
                    $defer.resolve($scope.allusers);
                }
            });
        }).error(function(err) {
            console.log(err);
            $scope.allusers = {};
        });
    }
    // ===================================================Get Employees End====================================================

    // ===================================================Custom Filter====================================================
    $scope.showFilter = false;
    $scope.refreshNgTable = function() {
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getEmployees();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getEmployees();
        }
    }

    $scope.customFilter = function(fpfnumber, fmonth) {
        console.log('customFilter', $scope.tableParams.data);
        $scope.tempdata = $scope.tableParams.data;
        var months = ["Jan", "Feb", "March", "April", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        console.log($scope.cfilter.option, " ", fpfnumber, " ", fmonth);
        var returnData;
        if (fpfnumber != undefined && fmonth != undefined && $scope.cfilter.option != undefined && $scope.cfilter.option == 'AND') {
            returnData = $scope.allusers.filter(function(item) {
                var arr = item.date.split("-");
                return item.pfNumber == fpfnumber && months[parseInt(arr[1], 10) - 1] == fmonth
            });
            if (returnData.length == 0) {
                SweetAlert.swal("Sorry", "No data found", "Error");
            } else {
                console.log(".allusers returned", returnData);
                $scope.allusers = returnData
            }
        } else if ((fpfnumber != undefined || fmonth != undefined) && $scope.cfilter.option != undefined && $scope.cfilter.option == 'OR') {
            returnData = $scope.allusers.filter(function(item) {
                var arr = item.date.split("-");
                return item.pfNumber == fpfnumber || months[parseInt(arr[1], 10) - 1] == fmonth
            });
            if (returnData.length == 0) {
                SweetAlert.swal("Sorry", "No data found", "Error");
            } else {
                console.log(".allusers returned", returnData);
                $scope.allusers = returnData
            }
        } else {
            SweetAlert.swal("warning", "Invalid parameters for AND | OR filter", "warning");
        }
    }
    // ===================================================Custom Filter====================================================

    $scope.fetchEmployee = function(uan) {
        httpService.get("getEmployee/" + uan)
            .success(function(employee) {
                console.log(employee)
            })
            .error(function(error) {
                console.log(error)
                SweetAlert.swal("error", "error in getting company", 'error')
            })
    }
    $scope.getOneCompany = function() {
        httpService.secureGet("getOneCompany/" + $rootScope.companyId)
            .success(function(company) {
                $rootScope.companyName = company.company.name;
                $scope.company = company.company;
                console.log(company);
            })
            .error(function(error) {
                console.log(error)
                SweetAlert.swal("error", "error in getting company", 'error')
            })
    }

    //==================================================================================
    $rootScope.$on('yearChanged', function(event, args) {
        $scope.months;
        $scope.year = args.newYear;
        $rootScope.year_ = args.newYear;
        $scope.pfNumber = '';
        $scope.empName = '';
        console.log(args);
        $scope.getEmployees();
    });
    //==================================================================================
    $scope.getEmployeePfForYear = function(pfNumber, year) {
        console.log(pfNumber, year);
        httpService.secureGet('api/v1/getEmployeesPfForYear/' + pfNumber + '/' + year)
            .success(function(res) {
                console.log(res);
                $scope.getMonths();
                if (res.docs.length == 0) {
                    console.log("No PF entries for this year");
                    SweetAlert.swal("Sorry..!", "No PF entries for this year");
                } else {
                    // $scope.doclen = res.docs.length;
                    var docLength = res.docs.length;
                    $scope.empName = res.docs[0].employeeId.name;
                    $scope.pfNumber = res.docs[0].employeeId.pfNumber;
                    // $scope.months[0].pfData = res.docs[0];
                    // console.log("$scope.months[0].pfData", $scope.months[0]);
                    var index = 0;
                    $scope.total.total_salary = 0;
                    $scope.total.total_employee_pf = 0;
                    $scope.total.total_employee_fp = 0;
                    $scope.total.total_employer_pf = 0;
                    $scope.total.total_employer_fp = 0;
                    angular.forEach(res.docs, function(pfEntry) {
                        // var date = new Date(pfEntry.date);
                        // var month = date.getMonth();
                        $scope.total.total_salary = parseInt($scope.total.total_salary) + parseInt(pfEntry.salary);
                        $scope.total.total_employee_pf = parseInt($scope.total.total_employee_pf) + parseInt(pfEntry.employee_pf);
                        $scope.total.total_employee_fp = parseInt($scope.total.total_employee_fp) + parseInt(pfEntry.employee_fp);
                        $scope.total.total_employer_pf = parseInt($scope.total.total_employer_pf) + parseInt(pfEntry.employer_pf);
                        $scope.total.total_employer_fp = parseInt($scope.total.total_employer_fp) + parseInt(pfEntry.employer_fp);
                        angular.forEach($scope.months, function(monthObject) {
                            if (monthObject.month == pfEntry.month) {
                                monthObject.pfData = pfEntry;
                            }
                        });
                        index = index + 1;
                        console.log("Total salary", $scope.total.total_salary);
                    });
                }
            })
            .error(function(err) {
                console.log(err);
            });
    };

    $scope.getMonths = function() {
        var today = new Date();

        if ($rootScope.year == undefined || $rootScope.year == null || $rootScope.year == '') {
            $scope.year = new Date().getFullYear();
        } else {
            $scope.year = $rootScope.year;
        }

        $scope.months = [
            { "name": 'April', "month": 4, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'May', "month": 5, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'June', "month": 6, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'July', "month": 7, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'Aug', "month": 8, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'Sept', "month": 9, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'Oct', "month": 10, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'Nov', "month": 11, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'Dec', "month": 12, "id": null, "year": parseInt($scope.year) - 1 },
            { "name": 'Jan', "month": 1, "id": null, "year": parseInt($scope.year) },
            { "name": 'Feb', "month": 2, "id": null, "year": parseInt($scope.year) },
            { "name": 'March', "month": 3, "id": null, "year": parseInt($scope.year) }
        ];

    }

    $scope.getEmployee = function(pfNumber) {
        if (pfNumber == null || pfNumber == undefined) {
            console.log("No pfNumber Found!!!");
        } else {
            httpService.secureGet("api/v1/employee/" + pfNumber + "/" + $rootScope.companyId)
                .success(function(res) {
                    console.log(res);
                    if (res.doc == null) {
                        swal({
                                title: "Employee",
                                text: "Do you want to add new employee",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Yes, Create it!",
                                closeOnConfirm: false
                            },
                            function() {
                                $state.go('app.myProfile', { companyId: $rootScope.companyId });
                                swal.close();
                            });
                    } else {
                        $scope.employeeFound = true;
                        $scope.monthlyPfModel.uan = res.doc.uan;
                        $scope.monthlyPfModel.name = res.doc.name;
                        $scope.monthlyPfModel.employeeId = res.doc._id;
                        $scope.monthlyPfModel.grossSalary = res.doc.currentSalary;
                    }
                })
                .error(function(err) {
                    console.log(err);
                })
        }
    }

    $scope.yearlyEntry = function(month) {
        $scope.getEmployee($scope.pfNumber);
        $scope.month = new Object();
        $scope.month.employeeId = $scope.monthlyPfModel.employeeId;
        $scope.month.uan = $scope.monthlyPfModel.uan;
        $scope.month.name = $scope.monthlyPfModel.name;
        $scope.month.salary = $scope.month.salary;
        // $scope.month.pageno

        if ($scope.month.employeeId == null || $scope.month.employeeId == undefined || $scope.month.employeeId == '') {
            //$state.go('app.addEmployee', $scope.company.company._id);
        } else {
            if (month.id == null) {
                $scope.month.date = new Date($scope.year, $scope.month.month, 20, 00, 00, 00, 00);
                $scope.pfCalculation();
                httpService.securePost("api/v1/savePfEntry", $scope.month)
                    .success(function(res) {
                        console.log(res);
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            } else {
                $scope.pfCalculation();
                httpService.securePost("api/v1/updatePfEntry", $scope.month)
                    .success(function(res) {
                        console.log(res);
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }
        }
    }
    // pfCalculation Function
    $scope.pfCalculation = function() {
        $scope.month.empPfSalaryLimit = $scope.month.grossSalary;
        $scope.month.pensSalaryLimit = $scope.month.grossSalary;
        if ($scope.company.pfSalaryLimit > 0 && $scope.month.grossSalary > $scope.company.pfSalaryLimit) {
            $scope.month.empPfSalaryLimit = $scope.comapny.pfSalaryLimit;
        }

        $scope.month.salary = $scope.month.empPfSalaryLimit;
        if ($scope.company.pensSalaryLimit > 0 && $scope.month.grossSalary > $scope.company.pensSalaryLimit) {

            $scope.month.pensSalaryLimit = $scope.company.pensSalaryLimit;
        }
        $scope.month.employee_pf = parseFloat($scope.month.empPfSalaryLimit) * parseFloat($scope.company.rateOfPfContribution) / 100;
        $scope.month.employee_fp = parseFloat($scope.month.empPfSalaryLimit) * parseFloat($scope.company.emplPens) / 100;

        $scope.month.ac2 = ($scope.month.empPfSalaryLimit) * ($scope.company.ac2) / 100;
        if ($scope.month.ac2 < 500) {
            $scope.month.ac2 = 500;
        }

        $scope.month.employer_fp = parseFloat($scope.month.pensSalaryLimit) * parseFloat($scope.company.emplPens) / 100;
        $scope.month.employer_pf = parseFloat($scope.month.employee_pf) - parseFloat($scope.month.employer_fp);

        $scope.month.ac21 = parseFloat($scope.month.pensSalaryLimit) * parseFloat($scope.company.ac21) / 100;
        if ($scope.month.ac21 < 75) {
            $scope.month.ac21 = 75;
        }

        $scope.month.ac22 = parseFloat($scope.month.pensSalaryLimit) * parseFloat($scope.company.ac22) / 100;
        if ($scope.month.ac22 < 200) {
            $scope.month.ac22 = 200;
        }
    }

    $scope.saveYearlyTable = function() {
        $scope.yearlyPFData = [];
        angular.forEach($scope.months, function(pfData) {
            (pfData.pfData) ? $scope.yearlyPFData.push(pfData.pfData): '';
        });
        console.log("YearlyPfData", $scope.yearlyPFData);
        httpService.securePut('api/v1/savePfEntryYearly', $scope.yearlyPFData)
             .success(function(res) {
                console.log("response", res);
                 SweetAlert.swal("updated!", "Record updated successfully", "success");
                 // $state.reload();
            })
            .error(function(err) {
                console.log(err);
            });
    }
    // xeditable methods
    $scope.saveUser = function($data, id) {
        console.log($data, id);
        $data._id = id;
        updatePfEntryUtility(id, $data);
        }
        // xeditable methods end
    $scope.copy = function(){
        console.log("Month selected",$scope.monthlyPfModel.copy);
        console.log("Company ID",$rootScope.companyId);
        console.log("Selected Year",$rootScope.year_);
        var dat = new Date('1 ' + $scope.monthlyPfModel.month + ' 1999');
        Selected_month=dat.getMonth()+1;
        console.log("previous now",Selected_month);
        console.log("unit Selected",$scope.monthlyPfModel.unit);
        httpService.secureGet("api/v1/copyPfEntry"+ "/"+ $rootScope.companyId+ "/" + $rootScope.year_+ "/" +$scope.monthlyPfModel.copy + "/" + Selected_month +"/"+$scope.monthlyPfModel.unit)
            .success(function(res) {
                console.log(res);
                SweetAlert.swal("success", res.message, "success");
            });
    }
    
    
    $scope.dt;
    $scope.monthlyEntry = function() {

        // $scope.monthlyPfModel.date = document.getElementById("monthNumber").value;
        if (isInArray($scope.monthlyPfModel.month, ['January','February', 'March'])) {
            $scope.monthlyPfModel.year = $scope.year;
        } else {
            $scope.monthlyPfModel.year = parseInt($scope.year) - 1;
        }
        console.log("####################", $scope.monthlyPfModel.month, isInArray($scope.monthlyPfModel.month, ['January', 'February', 'March']));
        $scope.monthlyPfModel.month = getMonthFromString($scope.monthlyPfModel.month);
        $scope.monthlyPfModel.empPfSalaryLimit = $scope.monthlyPfModel.grossSalary;
        $scope.monthlyPfModel.pensSalaryLimit = $scope.monthlyPfModel.grossSalary;
        //checking condition for pfsalary limit on company.
        if ($scope.company.pfSalaryLimit > 0 && $scope.monthlyPfModel.grossSalary > $scope.company.pfSalaryLimit) {
            $scope.monthlyPfModel.empPfSalaryLimit = $scope.company.pfSalaryLimit;
            console.log("$scope.company.PfSalaryLimit", $scope.company.pfSalaryLimit);
            console.log("$scope.monthlyPfModel.empPfSalaryLimit", $scope.monthlyPfModel.empPfSalaryLimit);

        }
        console.log("$scope.employee.PfSalaryLimit", $scope.monthlyPfModel.empPfSalaryLimit);

        $scope.monthlyPfModel.salary = $scope.monthlyPfModel.empPfSalaryLimit;
        //checking condtion for pensSalaryLimit
        if ($scope.company.pensSalaryLimit > 0 && $scope.monthlyPfModel.grossSalary > $scope.company.pensSalaryLimit) {

            $scope.monthlyPfModel.pensSalaryLimit = $scope.company.pensSalaryLimit;
            console.log("$scope.company.pensSalaryLimit", $scope.company.pensSalaryLimit);
            console.log("$scope.monthlyPfModel.pensSalaryLimit", $scope.monthlyPfModel.pensSalaryLimit);
        }
    console.log("$scope.employee.pensSalaryLimit", $scope.monthlyPfModel.pensSalaryLimit);

        $scope.monthlyPfModel.employee_pf = parseFloat($scope.monthlyPfModel.empPfSalaryLimit) * parseFloat($scope.company.rateOfPfContribution) / 100;
        $scope.monthlyPfModel.employee_fp = parseFloat($scope.monthlyPfModel.empPfSalaryLimit) * parseFloat($scope.company.emplPens) / 100;

        $scope.monthlyPfModel.ac2 = ($scope.monthlyPfModel.empPfSalaryLimit) * ($scope.company.ac2) / 100;
        if ($scope.monthlyPfModel.ac2 < $scope.company.minac2) {
            $scope.monthlyPfModel.ac2 = $scope.company.minac2;
        }

        $scope.monthlyPfModel.employer_fp = Math.round($scope.monthlyPfModel.pensSalaryLimit * $scope.company.emprPens / 100);
        $scope.monthlyPfModel.employer_pf = $scope.monthlyPfModel.employee_pf - $scope.monthlyPfModel.employer_fp;
        console.log("$scope.monthlyPfModel.employer_fp", $scope.monthlyPfModel.employer_fp);

        $scope.monthlyPfModel.ac21 = parseFloat($scope.monthlyPfModel.pensSalaryLimit) * parseFloat($scope.company.ac21) / 100;
        if ($scope.monthlyPfModel.ac21 < $scope.company.minac21) {
            $scope.monthlyPfModel.ac21 = $scope.company.minac21;
        }

        $scope.monthlyPfModel.ac22 = parseFloat($scope.monthlyPfModel.pensSalaryLimit) * parseFloat($scope.company.ac22) / 100;
       if ($scope.monthlyPfModel.ac22 < $scope.company.minac22) {
            $scope.monthlyPfModel.ac22 = $scope.company.minac22;
        }
        console.log("Final pfCalculation",$scope.monthlyPfModel);
        httpService.securePost("api/v1/savePfEntry", $scope.monthlyPfModel)
            .success(function(res) {
                if (res.pfDocStatus == true) {
                    swal({
                            title: "PF Entry Already Existed",
                            text: "Do you want to update this entry",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, Update it!",
                            closeOnConfirm: false
                        },
                        function() {
                            $scope.monthlyPfModel._id = res.doc._id;
                            console.log($scope.monthlyPfModel);
                            updatePfEntryUtility(res.doc._id, $scope.monthlyPfModel);
                            swal.close();
                        });
                } else {

                    SweetAlert.swal("success", res.message, "success");
                    //  $state.reload();
                }
            })
            .error(function(err) {
                SweetAlert.swal("error", err.message, "error");
            });
    }
    $scope.getOneCompany();
    $scope.getMonths();
    // $scope.getEmployees();

    //  Utility Functions
    function getMonthFromString(mon) {
        return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
    }

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }

    function updatePfEntryUtility(Id, model) {
        httpService.securePut("api/v1/updatePfEntry/" + Id, model)
            .success(function(res) {
                console.log(res);
                SweetAlert.swal("success", "Entry updated Successfully", "success");
                $scope.getEmployees();
            })
            .error(function(err) {
                console.log(err);
                swal.close();
                SweetAlert.swal("error", "there some error occured while updating the entry", "error");
            });
    }

    $scope.totalCount = function(object) {
        var index = 0;
        $scope.total.total_salary = 0;
        $scope.total.total_employee_pf = 0;
        $scope.total.total_employee_fp = 0;
        $scope.total.total_employer_pf = 0;
        $scope.total.total_employer_fp = 0;
        angular.forEach(object, function(pfEntry) {
            // var date = new Date(pfEntry.date);
            // var month = date.getMonth();
            $scope.total.total_salary = parseInt($scope.total.total_salary) + parseInt(pfEntry.salary);
            $scope.total.total_employee_pf = parseInt($scope.total.total_employee_pf) + parseInt(pfEntry.employee_pf);
            $scope.total.total_employee_fp = parseInt($scope.total.total_employee_fp) + parseInt(pfEntry.employee_fp);
            $scope.total.total_employer_pf = parseInt($scope.total.total_employer_pf) + parseInt(pfEntry.employer_pf);
            $scope.total.total_employer_fp = parseInt($scope.total.total_employer_fp) + parseInt(pfEntry.employer_fp);
        });
    }
    $scope.totalCountList = function(object) {
        var index = 0;
        $scope.total.total_salary1 = 0;
        $scope.total.total_employee_pf1 = 0;
        $scope.total.total_employee_fp1 = 0;
        $scope.total.total_employer_pf1 = 0;
        $scope.total.total_employer_fp1 = 0;
        angular.forEach(object, function(pfEntry) {
            // var date = new Date(pfEntry.date);
            // var month = date.getMonth();
            $scope.total.total_salary1 = parseInt($scope.total.total_salary1) + parseInt(pfEntry.salary);
            $scope.total.total_employee_pf1 = parseInt($scope.total.total_employee_pf1) + parseInt(pfEntry.employee_pf);
            $scope.total.total_employee_fp1 = parseInt($scope.total.total_employee_fp1) + parseInt(pfEntry.employee_fp);
            $scope.total.total_employer_pf1 = parseInt($scope.total.total_employer_pf1) + parseInt(pfEntry.employer_pf);
            $scope.total.total_employer_fp1 = parseInt($scope.total.total_employer_fp1) + parseInt(pfEntry.employer_fp);
        });
    }
    $scope.reset = function() {
        $scope.monthlyPfModel = {};
    }
    //  Utility Functions
    //Reports Uyility
    /* $scope.exportToExcel = function() {
         httpService.secureGet('api/v1/employeeListToExcel/' + $scope.companyId)
             .success(function(res) {
                 console.log(res);
                 window.location.assign('http://localhost:3000/employeeList.xlsx');
             })
             .error(function(err) {
                 console.log(err);
             });
     }*/
    $scope.reportService = reportService;
    $scope.exportToExcelEmpInfo = function() {
        httpService.secureGet('api/v1/employeeInfo/' + $scope.companyId)
            .success(function(res) {
                console.log(res);
                // window.location.assign('http://localhost:3000/foo.xlsx');
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

    // $scope.callModal = function(template, size) {
    //     var template_url = "/views/units/" + template;
    //     console.log(template_url, size, $location.port());
    //     modalService.openModal(template_url, 'unitCtrl', size);
    // }



    // $scope.exitUrl = reportService.bulkExit($scope.companyId, $rootScope.year_);
    // console.log($scope.exitUrl, reportService.bulkExit($scope.companyId, $rootScope.year_));

});