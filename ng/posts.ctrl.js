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
            PostSvc.fetch().success(function(posts) {
                $scope.posts = posts
            })
            $scope.$on('ws:new_post', function(_, post) { // The listener function is of the format function(event, args)
                $scope.$apply(function () { // $apply is used to execute an expression in angular from outside of the angular framework
                                            // Without  this the UI won't update
                                            // $scope.$on should trigger a digest cycle but it is not.
                                            // This may be an Angular bug.
                    $scope.posts.unshift(post)
                    // console.log("[posts.ctrl.js] new post!")
                    //console.log("[posts.ctrl.js] JSON.stringify(post): " + JSON.stringify(post))
                    //console.log("post.user_id.name is: " + post.user_id.username)
                })
            })
        })
