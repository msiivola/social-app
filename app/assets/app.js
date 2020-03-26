var app = angular.module("app", [
    'ngRoute'
])

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
   
    
    

// Note! Angular.module('app'), []) setter must be called earlier once
// otherwise the angular.modul('app') below will fail! See module.js.
angular.module('app')
        .controller('PostsCtrl', function($scope, PostSvc) { // Dependency-inject PostSvc which contains the $http dependency also
            $scope.addPost = function() {
                if ($scope.postBody) {
                    PostSvc.create({body: $scope.postBody})
                            .success(function(response) {
                                console.log("[posts.ctrl.js] success posting!")
                                // $scope.posts.unshift(post) // See below the implementation for WebSockets
                                $scope.postBody = null
                    })
                }
            }

            var playSound = function() {
                let audio = document.getElementById('player');
                // src="/banditb3.mp3" type="audio/mpeg"
                audio.src = "/owl.mp3";
                audio.load();
                audio.play();
            }        
            
            PostSvc.fetch().success(function(posts) {
                $scope.posts = posts
            })
            $scope.$on('ws:new_post', function(_, post) { // The listener function is of the format function(event, args)
                $scope.$apply(function () { // $apply is used to execute an expression in angular from outside of the angular framework
                                            // Without  this the UI won't update
                                            // $scope.$on should trigger a digest cycle but it is not.
                                            // This may be an Angular bug.
                    $scope.posts.unshift(post);
                    playSound();
                    // console.log("[posts.ctrl.js] new post!")
                    //console.log("[posts.ctrl.js] JSON.stringify(post): " + JSON.stringify(post))
                    //console.log("post.user_id.name is: " + post.user_id.username)
                })
            })
        })

// Consolidate all the logic for reading posts into one service.
// Here we could also take care of pagination, caching, authorization
// or even making multiple HTTP calls.
angular.module('app')
        .service('PostSvc', function($http) {
            this.fetch = function() {
                return $http.get('api/posts')
            }
            this.create = function(post) {
                return $http.post('api/posts', post)
            }
        })

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


// Define routes for the app. Each route has a controller and a template URl associated with it.
angular.module('app')
        .config(function ($routeProvider, $locationProvider) {
            // $locationProvider.html5Mode(true) // Enable HTML5 pushstate. No need to use "#" in the URL of the pages anymore.
            $routeProvider
            .when('/', { controller: 'PostsCtrl', templateUrl: 'posts.html' })
            .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
            .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
})


angular.module('app')
        .service('UserSvc', function($http) {
            var svc = this
            svc.createUser = function(username, password) {
                console.log("[User service] Creating user")
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


// Run blocks are the closest thing in Angular to the main method.
// A run block is the code which needs to run to kickstart the application.
// It is executed after all of the services have been configured and the
// injector has been created.
angular.module('app')
        .service('WebSocketSvc', function($rootScope, $timeout, $window) { // $rootScope is a singleton and the parent of each $scope inherits from.
                                    //It can be used to share global information through an application.
            
            // Take the hostname of the page and replace the HTTP/HTTPS part with WS/WSS
            function websocketHost() {
                if ($window.location.protocol === "https:")
                    return "wss://" + $window.location.host
                else
                    return "ws://" + $window.location.host
            }
            
            var connection
            this.connect = function() {
                // var url = 'ws://localhost:3000' // Hard-coded. Not good.
                console.log('Websocket connecting...')
                var url = websocketHost() // This implementation allows this app to be migrated to another server without a problem
                var connection = new WebSocket(url)
                var svc = this
                connection.onclose = function() { // In the event of the server not 
                    // responding, this will keep retrying forever because the close
                    // event is calledd when a connection is unsuccessful
                    console.log('Websocket closed. Reconnecting...')
                    $timeout(svc.connect, 10*1000)
                }
                connection.onmessage = function(e) {
                    var payload = JSON.parse(e.data)
                    $rootScope.$broadcast('ws:' + payload.topic, payload.data)
                    // $broadcast dispatches an event name downwards to all child scopes
                    // and their children) notifying the registered $rootScope.Scope listeners.
                }
            }
            // We could add a function to Posts Controller for marking
            // posts as 'viewed' if they land in the browser's viewport. 
            // That info could then be sent to the API by using WebSockets
            // and the function below.
            this.send = function(topic, data) {
                var json = JSON.stringify({topic: topic, data: data})
                connection.send(json)
            }          
        }).run(function(WebSocketSvc) {
            WebSocketSvc.connect()
        })
        