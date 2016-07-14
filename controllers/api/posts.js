var Post = require('../../models/post') // Bring in the Post model
var router = require('express').Router() // The Router object is a middleware that will act like an app object
var ws = require('../../websockets')
var User = require('../../models/user')

router.get('/', function (req, res, next) {
    Post.find()
            .sort('-date')
            .populate('user_id') // Pull the username field from the User model using the Populate feature
            .exec(function(err, posts) {
                if (err) {return next(err)}
                // console.log("[posts.js] posts[0].user_id.username: " + posts[0].user_id.username)
                // console.log("[posts.js] posts: " + JSON.stringify(posts))
                res.json(posts)
            })
})

router.post('/', function (req, res, next) {
    if (req.auth) {
        var post = new Post({body: req.body.body})
        User.findOne({username: req.auth.username}, function(err, user) {
            if (err) { return next(err) }
            // post.username = req.auth.username // The "auth" middleware will have generated this property earlier
            post.user_id = user._id
            // post.user_id = req.auth.username // In Mongoose 4.0 and greater, you can manually populate like this. Then post.user_id.username will give the username stored here.
            post.save(function (err, post) {
                if (err) {return next(err)}
                var post2 = post.toObject() // Create a new object from the post object to manually populate it later. Otherwise Schema checking will prevent the modification below.
                post2.user_id = {_id : user._id, username: req.auth.username} // Manually populate the username here because it should not be saved with the model
                //console.log("[posts.js] post.user_id.username: " + post_send.user_id.username)
                //console.log("[websockets.js] post after populating: " + JSON.stringify(post_send))
                ws.broadcast("new_post", post2)
                res.send(201) // Indicate success by sending a 201 "Created"
            })
    })
    } else {
        console.log("[posts.js] unauthorized!")
        res.send(401)  // User has not logged in. Request unauthorized.
    }
})

module.exports = router // expose the router object
