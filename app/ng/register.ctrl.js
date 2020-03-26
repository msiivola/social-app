angular.module('app')
        .controller('RegisterCtrl', function($scope, UserSvc) { 
                $scope.createUser = function(username, password) {
                    UserSvc.createUser(username, password)
                        .then(function() { // upon success ...
                            return UserSvc.login(username, password)
                        })
                        .catch(function(error) {
                            throw error.status + " " + error.data
                        })
                        .then(function(response) { // upon success ...
                            $scope.$emit('login', response.data) // Instead, send an event upwards to the/a parent controller
                        })
                }
        })

