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
        