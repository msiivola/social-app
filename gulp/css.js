
var gulp = require('gulp')
var stylus = require('gulp-stylus')

// Use Stylus to compile CSS from Stylus files (similar to SASS)
gulp.task('css', function() {
    gulp.src('css/**/*.styl')
            .pipe(stylus())
            .pipe(gulp.dest('assets'))
})

// Task for automatically rerunning Gulp upon changes to JS files
gulp.task('watch:css', ['css'], function() { // Add 'js' task as a dependency (optional). This ensures that when watch:js is first run, 'js' is run once right away.
    gulp.watch('css/**/*.styl', ['css']) // ['js'] is an array of tasks to run upon changes to any JS file in the folder
})