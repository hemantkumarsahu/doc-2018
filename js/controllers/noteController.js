angular.module('MetronicApp').controller('noteController', function($scope, $state, $rootScope,
    SweetAlert, httpService, $location, ngTableParams, $filter, $stateParams, $uibModal, $http, $window) {
   
   $scope.hidenote=false;
   $scope.shownote=false;

    $scope.getNote = function(){
        console.log("called getCheckUp");
        httpService.secureGet("doc/secure/getAllNote/all")
        .success(function(response) {
         console.log("response get Note",response);

            $scope.data = response.notes;
            // $scope.notesList = response.notes;
            
            $scope.tableParams = new ngTableParams({page: 1, count: 5}, 
            {
                total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        var notes = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        notes = params.filter() ? $filter('filter')(notes, params.filter()) : notes;
                        $scope.notesList = notes.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        params.total(notes.length);
                        $defer.resolve($scope.notesList);
                    }
             });
        })
        .error(function(error) {
           SweetAlert.swal("error", "error in getting notes", "error")
           console.log(error);
       })
    }
    $scope.getNote();
    $scope.deleteNote = function(id) {
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

                httpService.secureDelete('doc/secure/removeNote/'+id).then(function(response) {
                    SweetAlert.swal("Deleted!", "Record deleted successfully", "success");
                    $scope.getNote();
                }, function(error) {
                    alert("Oops! Some problem occured, please try again later");
                });
            }
        });
    }
     $scope.editNote = function($data, id) {
        console.log("edit checkup==================",$data,id);
        httpService.securePut('doc/secure/updateNote/'+id, $data)
        .success(function(res) {
            $scope.getNote();
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.showFilter = false;
    $scope.refreshNgTable = function() {
        if ($scope.showFilter) {
            $scope.showFilter = false;
            $scope.tableParams.reload();
            $scope.getNote();
        } else {
            $scope.showFilter = true;
            $scope.tableParams.reload();
            $scope.getNote();
        }
    }
    $scope.viewHistory=function(id){
    // $scope.checkUpDetails=true;
    // $scope.showHistory=true;
    console.log("doctor id=========",id);
    httpService.secureGet("doc/secure/getAllPescriptionByDocotrID/"+id)
    .success(function(response) {
            console.log("response",response);
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.goback=function(){
        $scope.hidenote=false;
        $scope.shownote=false;
    }


Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_note'));

});
