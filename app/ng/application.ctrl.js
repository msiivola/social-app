angular.module('app')
        .controller('ApplicationCtrl', function($scope, UserSvc, $http) { 
                if (localStorage.token) { // Dig into HTML 5 localStorage if a user has already logged in
                    $http.defaults.headers.common['X-Auth'] = localStorage.token // ... if so, set the X-Auth headers
                    UserSvc.getUser()
                            .then(function(user) {
                                //console.log("[ApplicationCtrl] got user.username: " + user.username)
                                $scope.currentUser = user  // .. and get the current user's info
                    })               
                }
                $scope.$on('login', function(_, user) {
                    console.log("[ApplicationCtrl] login event for:    " + user.username)
                    $scope.currentUser = user
                })
                $scope.logout = function () {
                    $scope.currentUser = null // Clear current user
                    UserSvc.logout() // Make sure HTTP headers do not include JWT
                } 
    })
   