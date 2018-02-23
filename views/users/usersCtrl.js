MetronicApp.controller('usersCtrl',
    function($rootScope, $state, $scope, httpService, $timeout, SweetAlert, $uibModal, ngTableParams, $filter) {

        httpService.get("secure/adminUsers")
            .success(function(response) {
                $scope.users = response.docs;

                var data = $scope.users;

                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    filter: {
                        // name: 'M' // initial filter
                    },
                    sorting: {
                        createdAt: "desc"
                            // name: 'asc' // initial sorting
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {
                        // use build-in angular filter



                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                        orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

                        $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.users);
                    }
                });

            })
            .error(function(err) {
                SweetAlert.swal("Error!", "Error loading users!!", "error");
            });


        $scope.deleteTemplate = function(id) {

            SweetAlert.swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this user later!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        httpService.delete("/secure/user/" + id)
                            .success(function(response) {
                                SweetAlert.swal("Deleted!", "User deleted successfully.", "success");
                                $state.reload();
                            })
                            .error(function(err) {
                                SweetAlert.swal("Error!", "Error deleting user!!", "error");
                            });
                    } else {
                        SweetAlert.swal("Cancelled", "Your user is safe :)", "error");
                    }
                });
        };

        $scope.addUser = function(size) {

            var modalInstance = $uibModal.open({
                templateUrl: 'views/users/addUser.html',
                controller: 'addUserCtrl',
                size: size,
                resolve: {
                    modalData: function() {
                        return {};
                    }
                }
            });

        };

        $scope.editUser = function(user) {
            /*$scope.temp1 = {};
            _.each(user, function(attr, index) {
                $scope.temp1[index] = attr;
            });*/

            var modalInstance = $uibModal.open({
                templateUrl: 'views/users/editUser.html',
                controller: 'editUserCtrl',
                size: 'md',
                resolve: {
                    modalData: function() {
                        return { "user": user };
                    }
                }
            });
        }

        $scope.deleteUser = function(userId) {
            console.log(userId);
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this record!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (isConfirm) {

                    httpService.secureDelete('secure/user/' + userId).then(function(response) {
                        SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                        $state.reload();
                    }, function(error) {
                        alert("Oops! Some problem occured, please try again later");
                    });
                }

            });
        }


        
    });
