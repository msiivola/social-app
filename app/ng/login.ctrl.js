angular.module('app')
        .controller('LoginCtrl', function($scope, UserSvc) { 
                $scope.login = function(username, password) {
                    UserSvc.login(username, password)
                            .then(function(response) { // upon success ...
                                //$scope.currentUser = response // This approach would not work because LoginCtrl isn't scoped all the way out to the appropriate level
                                $scope.$emit('login', response) // Instead, send an even upwards to the/a parent controller
                                console.log("Success logging in!");
                    })
                }
        })
   
    
    
