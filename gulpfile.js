
gulp = require('gulp')

// Include all files under the gulp/ folder, making all Gulp tasks available via gulpfile.js
var fs = require('fs')
fs.readdirSync(__dirname + '/gulp').forEach(function(task) {
    require('./gulp/' + task)
})

// To keep all the required tasks running, create a Gulp 'dev' task to run them automatically
gulp.task('dev', ['watch:css', 'watch:js', 'dev:server']) // Now if you run 'dev', the two 'watch' processes will begin automatically