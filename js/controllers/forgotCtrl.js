angular.module('MetronicApp').controller('forgotCtrl', function($scope, $state, httpService, $stateParams) {

    $scope.sendForgotLink = function() {
        if ($scope.frmforgotPassword.$valid) {
            var data = { headers: {}, templateVars: {} };
            data.headers.from = 'bhandari.kalyani@gmail.com';
            httpService.post('sendForgotLink/' + $scope.forgotModel.email, data)
                .then(function(response) {
                        //$state.go("login");
                    },

                    function(error) {
                        alert("Oops! Some problem occured, please try again later");
                    });
        }

    };
});
