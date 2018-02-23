angular.module('MetronicApp').controller('loginCtrl', function($rootScope, $http,$scope, httpService, $window, SweetAlert, $state) {
    // scope = $scope;
    $scope.doLogin = function() {
            httpService.securePost("login", $scope.userData)
          
            .success(function(response) {
                console.log("res=============",response);
                console.log(response.token);
                console.log("Response User=======",response.user);
                $rootScope.user = response.user;
                $window.localStorage.setItem("user",JSON.stringify($rootScope.user));
                $window.localStorage.setItem("userId",$rootScope.user._id);
                $window.localStorage.setItem("userName",($rootScope.user.name));
                $window.localStorage.setItem("x-access-token", response.token);
                $window.localStorage.setItem("xKey", $rootScope.user.email);
                $state.go('app.dashboard');

            })
            .error(function(err) {
              console.log("error in login");
                SweetAlert.swal("Error!", err.message, "error");
            });


    };

});
