angular.module('app')
        .service('UserSvc', function($http) {
            var svc = this
            svc.createUser = function(username, password) {
                return $http.post('/api/users', {username: username, password: password})       
            }
            svc.getUser = function() {
                return $http.get('/api/users')
                        .then(function (response) {
                            return response.data}) // This goes out with the X-Auth header as per below
                                                    // which means that this GET request will return a JSON object with user info                             
            }
            svc.login = function(username, password) {
                return $http.post('/api/sessions', {
                    username: username, password: password // The API returns a JWT (token) upon this request
                }).then(function (val) {
                    // svc.token = val.data // This would store the token in the JavaScript environment. A browser refresh would cause the login to clear out.
                    localStorage.token = val.data // ... so instead, let's save the token to HTML 5 localStorage, the browser's own memory space.
                    $http.defaults.headers.common['X-Auth'] = val.data  // Start sending the X-Auth header with the JWT by default
                                                                        // with every request!
                    return svc.getUser() // This is the return value for svc.login (a JSON object)
                })
            }
            svc.logout = function() {
                delete $http.defaults.headers.common['X-Auth'] // Stop sending the JWT on HTTP requests
                delete localStorage.token // Clear the token from HTML 5 localStorage
            }
        })

