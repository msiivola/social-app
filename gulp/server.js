
var gulp = require('gulp')
var nodemon = require('gulp-nodemon')

// Standard version requiring manual re-start
//gulp.task('dev', ['watch:css', 'watch:js'])

// Nodemon version

gulp.task('dev:server', function() {
    nodemon({
        script: 'server.js', // Script to restart automatically ...
        ext:    'js', // ... when any JS file changes ...
        ignore: ['ng*', 'gulp*', 'assets*'] // ... except when the JS files are in these locations
    })
})