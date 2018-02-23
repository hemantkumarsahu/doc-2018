angular.module('MetronicApp').service('httpService', httpService);

function httpService($rootScope, $http, $window) {

    this.get = function(url) {
        return $http({
            url: BASE_URL + url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    this.post = function(url, data) {

        return $http({
            url: BASE_URL + url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    this.delete = function(url) {
        return $http({
            url: BASE_URL + url,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.secureGet = function(url) {
        return $http({
            url: BASE_URL + url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem("x-access-token"),
                'x-key': $window.localStorage.getItem("xKey")
            }

        });
    };
    this.securePost = function(url, data) {
        return $http({
            url: BASE_URL + url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem("x-access-token"),
                'x-key': $window.localStorage.getItem("xKey")
            },
            data: data
        });
    };

    this.securePut = function(url, data) {
        return $http({
            url: BASE_URL + url,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem("x-access-token"),
                'x-key': $window.localStorage.getItem("xKey")
            },
            data: data

        });
    };

    this.secureDelete = function(url) {
        return $http({
            url: BASE_URL + url,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem("x-access-token"),
                'x-key': $window.localStorage.getItem("xKey")
            }

        });
    };

    this.secureFilePost = function(url, data) {
        return $http({
            url: BASE_URL + url,
            method: "POST",
            headers: {
                'Content-Type': undefined,
                'x-access-token': $window.localStorage.getItem("x-access-token"),
                'x-key': $window.localStorage.getItem("xKey")
            },
            data: data

        });
    };


};
