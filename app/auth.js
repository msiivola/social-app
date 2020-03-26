var jwt = require('jwt-simple')
var config = require('./config')
// var User = require('./models/user')

// This middleware will attach an "auth" object to requests
// for looking up the current user's information.
module.exports = function(req, res, next) {
    if (req.headers['x-auth']) {
        var token = req.headers['x-auth']
        // var user = jwt.decode(token, config.secret) // Attach the auth object for later use by other programs
        req.auth = jwt.decode(token, config.secret) // Attach the auth object for later use by other programs
        // console.log("[Auth.js] req.auth._id: " + req.auth._id)
        //console.log("[Auth.js] req.auth.username is: " + req.auth.username)
    }
    else {
        req.auth = null
    }
    // If the current middleware function does not end the request-response cycle,
    // it must call next() to pass control to the next middleware function.
    // Otherwise, the request will be left hanging.
    next()
}


