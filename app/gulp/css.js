
var gulp = require('gulp')
// var stylus = require('gulp-stylus')
var less = require('gulp-less');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');

var styles=  {
      src: 'css/**/*.css',
      dest: 'assets'
    };
   
/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(styles.src)
    //   .pipe(less())
      .pipe(cleanCSS())
      // pass in options to the stream
    //   .pipe(rename({
    //     basename: 'main',
    //     suffix: '.min'
    //   }))
      .pipe(gulp.dest(paths.styles.dest));
  }

gulp.task('build', styles);

// Use Stylus to compile CSS from Stylus files (similar to SASS)
// gulp.task('css', function() {
//     gulp.src('css/**/*.styl')
//             .pipe(stylus())
//             .pipe(gulp.dest('assets'))
// })

// Task for automatically rerunning Gulp upon changes to JS files
// gulp.task('watch:css', ['css'], function() { // Add 'js' task as a dependency (optional). This ensures that when watch:js is first run, 'js' is run once right away.
//     gulp.watch('css/**/*.styl', ['css']) // ['js'] is an array of tasks to run upon changes to any JS file in the folder
// })