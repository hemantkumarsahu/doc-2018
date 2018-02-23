MetronicApp.controller('getUrlCtrl', function($scope, $uibModalInstance, modalData) {

    $scope.naturalURL = modalData.naturalURL;
    $scope.trackingURL = modalData.trackingURL;

    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };
});

MetronicApp.controller('myFilesCtrl', function($rootScope, $scope, httpService, $timeout, SweetAlert, $uibModal, ngTableParams, $filter) {

    httpService.get("secure/getUserFiles/" + $rootScope.user._id)
        .success(function(response) {
            $scope.files = response.docs;

            var tempFiles = [];
            var i = 0;

            for (var file of $scope.files) {
                var templates = [];
                for (var template of file.pdfTemplates) {
                    templates.push(template.name);
                }
                tempFiles.push(file);
                tempFiles[i].templates = templates.join(", ");
                i++;
            }

            $scope.files = tempFiles;

            var data = $scope.files;

            $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    filter: {
                        // name: 'M' // initial filter
                    },
                    sorting: {
                        createdAt : "desc"
                        // name: 'asc' // initial sorting
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {
                        // use build-in angular filter



                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                        orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

                        $scope.files = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.files);
                    }
                });

        })
        .error(function(err) {
            SweetAlert.swal("Error!", "Error loading files!!", "error");
        });

    $scope.getURLs = function(file) {
        date = new Date(file.createdAt);

        var year = date.getFullYear();
        var month = date.getMonth() + 1;

        var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/get-urls.html',
            size: 'md',
            controller: "getUrlCtrl",
            resolve: {
                modalData: function() {
                    return {
                        naturalURL: BASE_URL + year + "/" + month + "/" + file._id + ".pdf",
                        trackingURL: BASE_URL + "getFile?id=" + file._id
                    };
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            //$log.info('Modal dismissed at: ' + new Date());
        });

    };
});
