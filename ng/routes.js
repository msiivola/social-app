// Define routes for the app. Each route has a controller and a template URl associated with it.
angular.module('app')
        .config(function ($routeProvider, $locationProvider) {
            // $locationProvider.html5Mode(true) // Enable HTML5 pushstate. No need to use "#" in the URL of the pages anymore.
            $routeProvider
            .when('/', { controller: 'PostsCtrl', templateUrl: 'posts.html' })
            .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
            .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
})

