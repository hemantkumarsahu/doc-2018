angular.module('MetronicApp')
    .service('modalService', modalService)
    .service('multipartForm',multipartForm);

function modalService($uibModal) {
    this.openModal = function(template, controller, size) {
        var modalInstance = $uibModal.open({
            templateUrl: template,
            controller: controller,
            size: size,
        });
    }
}
function multipartForm($http){
	this.post = function(uploadUrl, data){
    		var fd= new FormData();
    		for(var key in data)
    			fd.append(key,data[key]);
    		$http.post(uploadUrl, fd,{
    			transformRequest : angular.indentity,
    			headers:{ 'Content-Type' : undefined}
    		})
    	}
}

