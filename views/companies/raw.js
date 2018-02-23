/*$scope.data = [
            {  "pfNumber": 50,"month": 50,"year": 50,"salary": 50,"emplpf": 50,"emplfp": 50,"emplrpf": 50,"emplrfp": 50 },
            {  "pfNumber": 43,"month": 43,"year": 43,"salary": 43,"emplpf": 43,"emplfp": 43,"emplrpf": 43,"emplrfp": 43 },
            {  "pfNumber": 27,"month": 27,"year": 27,"salary": 27,"emplpf": 27,"emplfp": 27,"emplrpf": 27,"emplrfp": 27 },
            {  "pfNumber": 29,"month": 29,"year": 29,"salary": 29,"emplpf": 29,"emplfp": 29,"emplrpf": 29,"emplrfp": 29 },
            {  "pfNumber": 34,"month": 34,"year": 34,"salary": 34,"emplpf": 34,"emplfp": 34,"emplrpf": 34,"emplrfp": 34 },
            {  "pfNumber": 43,"month": 43,"year": 43,"salary": 43,"emplpf": 43,"emplfp": 43,"emplrpf": 43,"emplrfp": 43 },
            {  "pfNumber": 27,"month": 27,"year": 27,"salary": 27,"emplpf": 27,"emplfp": 27,"emplrpf": 27,"emplrfp": 27 },
            {  "pfNumber": 29,"month": 29,"year": 29,"salary": 29,"emplpf": 29,"emplfp": 29,"emplrpf": 29,"emplrfp": 29 },
            {  "pfNumber": 34,"month": 34,"year": 34,"salary": 34,"emplpf": 34,"emplfp": 34,"emplrpf": 34,"emplrfp": 34 },
            {  "pfNumber": 43,"month": 43,"year": 43,"salary": 43,"emplpf": 43,"emplfp": 43,"emplrpf": 43,"emplrfp": 43 },
            {  "pfNumber": 27,"month": 27,"year": 27,"salary": 27,"emplpf": 27,"emplfp": 27,"emplrpf": 27,"emplrfp": 27 },
            {  "pfNumber": 29,"month": 29,"year": 29,"salary": 29,"emplpf": 29,"emplfp": 29,"emplrpf": 29,"emplrfp": 29 },
            {  "pfNumber": 34,"month": 34,"year": 34,"salary": 34,"emplpf": 34,"emplfp": 34,"emplrpf": 34,"emplrfp": 34 },
            {  "pfNumber": 43,"month": 43,"year": 43,"salary": 43,"emplpf": 43,"emplfp": 43,"emplrpf": 43,"emplrfp": 43 },
            {  "pfNumber": 27,"month": 27,"year": 27,"salary": 27,"emplpf": 27,"emplfp": 27,"emplrpf": 27,"emplrfp": 27 },
            {  "pfNumber": 29,"month": 29,"year": 29,"salary": 29,"emplpf": 29,"emplfp": 29,"emplrpf": 29,"emplrfp": 29 },
            {  "pfNumber": 34,"month": 34,"year": 34,"salary": 34,"emplpf": 34,"emplfp": 34,"emplrpf": 34,"emplrfp": 34 }
        ];*/
< div class = "input-group input-medium date date-picker-month "
data - date - format = "mm/yyyy "
data - date - viewmode = "years "
data - date - minviewmode = "months " >
    <
    input type = "text"
class = "form-control"
uib - datepicker - popup = "{{format}}"
style = "width: 277px;"
id = "monthNumber"
ng - model = "dt"
is - open = "popup1.opened"
datepicker - options = "dateOptions"
ng - required = "true"
close - text = "Close"
alt - input - formats = "altInputFormats" /
    >
    <
    span class = "input-group-btn" > < button type = "button"
class = "btn btn-default"
ng - click = "open1()" > < i class = "glyphicon glyphicon-calendar" > < /i></button > < /span>
    <!--  <input type="text" class="form-control" id="monthYear" style="width: 277px;" name="monthYear" value="">
    <
    span style = "width: 10px;"
class = "input-group-btn" > < button class = "btn default"
ng - click = "open($event)"
type = "button" > < i class = "fa fa-calendar " > < /i></button > < /span> --> <
    /div>
angular.forEach(res.docs, function(pfEntry) {
    console.log("########", pfEntry);
    var obj = {};
    var date = new Date(pfEntry.date);
    var month = date.getMonth();
    console.log("MONTH", month);
    var yearly = date.getFullYear();
    if (month == 1) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Jan' && yearly == year) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Jan';
                    obj.month = month;
                    obj.year = yearly;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(1);
                }
            }
        });
    } else if (month == 2) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Feb' && yearly == year) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Feb';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(2);
                }
            }
        });

    } else if (month == 3) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'March' && yearly == year) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'March';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(3);
                }
            }
        });
    } else if (month == 4) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'April' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'April';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(4);
                }
            }
        });

    } else if (month == 5) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'May' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'May';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(5);
                }
            }
        });

    } else if (month == 6) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'June' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'June';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(6);
                }
            }
        });

    } else if (month == 7) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'July' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'July';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(7);
                }
            }
        });

    } else if (month == 8) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Aug' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Aug';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(8);
                }
            }
        });

    } else if (month == 9) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Sept' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Sept';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(9);
                }
            }
        });


    } else if (month == 10) {
        var cnt = 0;
        obj.year = yearly;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Oct' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Oct';
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(10);
                }
            }
        });

    } else if (month == 11) {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Nov' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Nov';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(11);
                }
            }
        });

    } else {
        var cnt = 0;
        var len = $scope.months.length;
        angular.forEach($scope.months, function(monty) {
            if (monty.name == 'Dec' && yearly == year - 1) {
                cnt = 1
            }
            len--;
            if (len == 0) {
                if (cnt == 0) {
                    obj.name = 'Dec';
                    obj.year = yearly;
                    obj.month = month;
                    obj.id = pfEntry._id;
                    obj.salary = pfEntry.salary;
                    obj.employee_pf = pfEntry.employee_pf;
                    obj.employee_fp = pfEntry.employee_fp;
                    obj.employer_pf = pfEntry.employer_pf;
                    obj.employer_fp = pfEntry.employer_fp;
                    $scope.months.push(obj);
                    $scope.monthsArray.push(12);
                }
            }
        });

    }
});
console.log("$scope.monthsArray", $scope.monthsArray);
docLength--;
if (docLength == 0) {
    if ($scope.months.length != 12) {
        if ($scope.monthsArray.indexOf(1) !== -1) {
            obj.name = 'Jan';
            obj.month = 1;
            obj.year = year;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(1);
        }
        if ($scope.monthsArray.indexOf(2) !== -1) {
            obj.name = 'Feb';
            obj.month = 2;
            obj.year = year;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(2);
        }
        if ($scope.monthsArray.indexOf(3) !== -1) {
            obj.name = 'March';
            obj.month = 3;
            obj.year = year;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(3);
        }
        if ($scope.monthsArray.indexOf(4) !== -1) {
            obj.name = 'April';
            obj.month = 4;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(4);
        }
        if ($scope.monthsArray.indexOf(5) !== -1) {
            obj.name = 'May';
            obj.month = 5;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(5);
        }
        if ($scope.monthsArray.indexOf(6) !== -1) {
            obj.name = 'June';
            obj.month = 6;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(6);
        }
        if ($scope.monthsArray.indexOf(7) !== -1) {
            obj.name = 'July';
            obj.month = 7;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(7);
        }
        if ($scope.monthsArray.indexOf(8) !== -1) {
            obj.name = 'Aug';
            obj.month = 8;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(8);
        }
        if ($scope.monthsArray.indexOf(9) !== -1) {
            obj.name = 'Sept';
            obj.month = 9;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(9);
        }
        if ($scope.monthsArray.indexOf(10) !== -1) {
            obj.name = 'Oct';
            obj.month = 10;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(10);
        }
        if ($scope.monthsArray.indexOf(11) !== -1) {
            obj.name = 'Nov';
            obj.month = 11;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(11);
        }
        if ($scope.monthsArray.indexOf(12) !== -1) {
            obj.name = 'Dec';
            obj.month = 12;
            obj.year = year - 1;
            obj.employee_pf = 0;
            obj.id = 0;
            obj.employee_fp = 0;
            obj.employer_pf = 0;
            obj.employer_fp = 0;
            $scope.months.push(obj);
            $scope.monthsArray.push(12);
        }
    }
}