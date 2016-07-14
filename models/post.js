// Mongoose model for a Post. This uses Mongoose's Populate
// feature to store with ObjectIds from the User model
// in the a stored document representing a user's post.
// http://mongoosejs.com/docs/2.7.x/docs/populate.html
var db = require('../db')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Post = db.model('Post', {
    // username: {type: String, required: true},
    body:     {type: String, required: true},
    date:     {type: Date, required: true, default: Date.now},
    user_id:  {type: Schema.Types.ObjectId, ref: 'User'} // The 'User' ref
    // tells Mongoose in which model to look for the ObjectId
})
module.exports = Post // expose Post module


