/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ui.mask",
    "ngSanitize",
    "oitozero.ngSweetAlert",
    "ngMessages",
    "ngTable",
    "signature",
    "angularFileUpload",
    "angularMoment",
    "xeditable",
    'pdfjsViewer',
   
]);
MetronicApp.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 0 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout2',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$window', 'SweetAlert', function($scope, $rootScope, $window, SweetAlert) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        $scope.doctorId = $rootScope.doctorId;
        // console.log("$scope.companyId", $rootScope.companyId);
        $rootScope.authenticate();

        var xToken = $window.sessionStorage.getItem("x-access-token");
        $rootScope.xToken = JSON.parse(xToken);

    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$rootScope', '$uibModal', '$window', '$state', function($scope, $rootScope, $uibModal, $window, $state) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    $scope.changePassword = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/changePassword/changePassword.html',
            controller: 'changePasswordCtrl',
            size: 'md',
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    //DatePicker in the header
    $scope.today = function() {
        $scope.dt = new Date();
        $rootScope.year_ = $scope.dt.getFullYear();
        $scope.prevYear = $scope.dt.getFullYear() - 1;
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        minMode: 'year'
    };

    $scope.formats = ['yyyy'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    $scope.changeYear = function(dt) {
        $rootScope.year = dt.getFullYear();
        $scope.prevYear = $rootScope.year - 1;
        $rootScope.$emit('yearChanged', { newYear: $rootScope.year });
    }



}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Init global settings and run the app */
MetronicApp.run(function($rootScope, settings, $state, $window, $uibModal, SweetAlert) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.$on("$stateChangeError", console.log.bind(console));

    $rootScope.$on("$stateChangeSuccess", function(event, toState, fromState) {
        $rootScope.authenticate();
    });

    $rootScope.logout = function() {
        console.log("called logout===========================");
        $window.localStorage.clear();
        $state.go("login");
    };

    $rootScope.authenticate = function() {

        if ($state.current.name.split(".")[0] == "app") {
            $rootScope.user = JSON.parse($window.localStorage.getItem("user"));

            if ($state.current.name == "app.dashboard") {
                $rootScope.headerPic = true;
            } else {
                $rootScope.headerPic = false;
            }

            if (!$rootScope.user) {
                 $rootScope.logout();
                SweetAlert.swal({
                    title:'Sorry!',
                    text:'Session has been Expired',
                    type:'info',
                    timer:2000
                });
               
                return;
            }
            $rootScope.token = $window.localStorage.getItem("token");
            // $rootScope.isAdminLoggedIn = $rootScope.user.type == "admin" ? true : false;
        }

        if ($state.current.name.split(".")[0] == "app") {
            $rootScope.user = JSON.parse($window.localStorage.getItem("user"));
        }

    };
});