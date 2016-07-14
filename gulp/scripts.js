
var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemaps = require('gulp-sourcemaps')

// Concatenate all JS files into a single assets/app.js
gulp.task('js', function() { // Task name is 'js'
    gulp.src(['ng/module.js', 'ng/**/*.js']) // Load the files into a stram. Load module.js first because it defines the 'app' 
            .pipe(sourcemaps.init()) // Source mapping allows better debugging through the Web browser
                .pipe(concat('app.js')) // Pipe through the concat plugin
                .pipe(ngAnnotate()) // Angular JS is not directly compatible with minimzers. NG Annotate rewrites the syntax so that is minimizer friendly.
                .pipe(uglify()) // Minimize the code
            .pipe(sourcemaps.write())    
            .pipe(gulp.dest('assets')) // Output to gulp.dest
})

// Task for automatically rerunning Gulp upon changes to JS files
gulp.task('watch:js', ['js'], function() { // Add 'js' task as a dependency (optional). This ensures that when watch:js is first run, 'js' is run once right away.
    gulp.watch('ng/**/*.js', ['js']) // ['js'] is an array of tasks to run upon changes to any JS file in the folder
})
