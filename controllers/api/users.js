var router = require('express').Router() // The Router object is a middleware that will act like an app object
var User = require('../../models/user') // Bring in the User model
var bcrypt = require('bcrypt') // BCrypt is a hashing algorithm that is intentionally slow, making brute-force attacks too expensive to do
var jwt = require('jwt-simple')
var config = require('../../config.js')

// Return a user based on token
router.get('/', function (req, res, next) {
    if (req.auth) {
        User.findOne({username: req.auth.username}, function(err, user) {
            if (err) { return next(err) }
            //console.log("user whose info is requested: " + user)
            //console.log("user _id: " + user._id)
            res.json(user)
         })
     }
})

// Create a new user
router.post('/', function(req, res) {
    var user = new User({username: req.body.username})
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        user.password = hash
        user.save(function(err) {
            if (err) { return next(err) }
            console.log("[users.js] user saved!")
            res.send(201)
        })
    })
})

module.exports = router // expose the router object


