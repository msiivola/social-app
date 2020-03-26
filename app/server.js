// Global middleware
var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post') // Bring in the model for posts
var ws = require('./websockets')
var app = express()

// - Mount middleware -
// Middleware functions are functions that have access to the request object (req), the response object (res),
// and the next middleware function in the application’s request-response cycle.
// The next middleware function is commonly denoted by a variable named next.
app.use(bodyParser.json())
app.use(require('./auth.js')) // Find out information on the user. This is processed for any incoming requests.

// Mount controllers
app.use('/api/posts', require('./controllers/api/posts')) // Handle posts and connection to db
app.use('/', require('./controllers/static')) // equivalent to app.use(require('./controllers/static'))
app.use('/api/sessions', require('./controllers/api/sessions'))
app.use('/api/users', require('./controllers/api/users'))

// Tell server to listen
var server = app.listen(3000, function() {
    console.log('Server listening on', 3000)
})

// Add WebSockets to the server
ws.connect(server)

// Test comment #1
