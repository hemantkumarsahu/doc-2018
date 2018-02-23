angular.module('MetronicApp').controller('viewerCtrl', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $http, $window, $sce) {
    $scope.filePath;
    $scope.DOWNLOAD_URL = 'http://localhost:3000/';
    $scope.filePath = $scope.DOWNLOAD_URL + $stateParams.path;
    console.log('PATH :', $stateParams.path);
    console.log('PATH :', $scope.filePath);
}).filter('trustUrl', function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
});;