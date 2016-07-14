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
