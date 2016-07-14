// MongoDB model for the user
var db = require('../db')
var Schema = require('mongoose').Schema

var user = db.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true, select: false},
    // posts: [{type:Schema.Types.ObjectId, ref: 'Post'}] // All _ids we
    // store here must be document _ids from the Post model
})
module.exports = db.model('User', user)
        
        

