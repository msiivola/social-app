// Define a function connect that addes WebSockets to a Node server
var ws = require('ws')
var _ = require('lodash')
var clients = [] // An empty array for tracking all clients

exports.connect = function(server) {
    var wss = new ws.Server({server: server})
    wss.on('connection', function(ws) { // When a client connects, send a message directly to the client
        clients.push(ws) // Keep track of clients
        //exports.broadcast('new client joined')
        //console.log("added client")
//        ws.on('message', function(msg) {
//            ws.send("Got: " + msg)
//        })
        ws.on('close', function() {
            _.remove(clients, ws) // Use helper function from Lo-Dash to remove this client
        })
    })
}

exports.broadcast = function(topic, data) {
    var json = JSON.stringify({topic: topic, data: data}) // The JSON.stringify() method converts a JavaScript value to a JSON string,
    // console.log("[websockets.js] sending data: " + JSON.stringify(data))
    clients.forEach(function(client) {
        client.send(json)
    })
}

// Added comment to test Git
