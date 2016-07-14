var router = require('express').Router() // The Router object is a middleware that will act like an app object
var User = require('../../models/user') // Bring in the User model
var bcrypt = require('bcrypt') // BCrypt is a hashing algorithm that is intentionally slow, making brute-force attacks too expensive to do
var jwt = require('jwt-simple')
var config = require('../../config')

router.post('/', function (req, res, next) {
    User.findOne({username: req.body.username})
    .select('password').select('username') // Turn on selection for password (turned off in the model)
    .exec(function (err, user) {
        if (err) { return next(err) }
        if (!user) { return res.send(401) } // Unauthorized
        bcrypt.compare(req.body.password, user.password, function(err, valid) {
            if (err) { return next(err) }
            if (!valid) { return res.send(401) }
            var token = jwt.encode({username: user.username}, config.secret) // Create a JWT token with the username as payload, signed with the secret key
            res.send(token)
        })
    })
})

module.exports = router // expose the router object


