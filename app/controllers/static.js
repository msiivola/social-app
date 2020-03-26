/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Bring in Express, it comes with built-in middleware for serving static assets
var express = require('express')
var router = express.Router() // The Router object is a middleware that will act like an app object

router.use(express.static(__dirname + '/../assets')) // __dirname is a special Node variable
// that points to the current file's directory, /controllers in this case

router.get('/', function(req, res) {
  res.sendfile('layouts/app.html')  
})

router.use(express.static(__dirname + '/../templates')) // __dirname is a special Node variable

module.exports = router

