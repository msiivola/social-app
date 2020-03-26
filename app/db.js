// var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/social', function() {
//     console.log('mongodb connected')
// })

var mongoose = require('mongoose');

// Create a pending connection to the database 
mongoose.connect('mongodb://mongo:27017/social', {useNewUrlParser: true});

// Now get notified if connection is successful
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("[db.js] connected!")
});

module.exports = mongoose


