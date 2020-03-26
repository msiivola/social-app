const { parallel, src, dest } = require('gulp');

var paths = {
    scripts: {
        src: ['ng/module.js', 'ng/**/*.js'], 
        dest: 'assets'
    },
    styles: {
        src: 'css/**/*.css',
        dest: 'assets'
    }
  };

function build() {

}

var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');

function scripts() {
    return src(paths.scripts.src, { sourcemaps: true })
//   .pipe(babel())
    .pipe(concat('app.js'))
//   .pipe(ngAnnotate()) // Angular JS is not directly compatible with minimzers. NG Annotate rewrites the syntax so that is minimizer friendly.
    // .pipe(uglify())
    .pipe(dest(paths.scripts.dest));
}


// var less = require('gulp-less');
// var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');

/*
 * Define our tasks using plain functions
 */
function styles() {
    return src(paths.styles.src)
    //   .pipe(less())
      .pipe(cleanCSS())
    //   pass in options to the stream
    //   .pipe(rename({
    //     basename: 'main',
    //     suffix: '.min'
    //   }))
      .pipe(dest(paths.styles.dest));
  };

exports.build = build;
exports.scripts = scripts;
exports.styles = styles;
exports.default = parallel(styles, scripts);

///////// OLD STUFF

// Include all files under the gulp/ folder, making all Gulp tasks available via gulpfile.js
// var fs = require('fs')
// fs.readdirSync(__dirname + '/gulp').forEach(function(task) {
//     require('./gulp/' + task)
// })


//var build = gulp.series(clean, gulp.parallel(styles, scripts));

// To keep all the required tasks running, create a Gulp 'dev' task to run them automatically
// gulp.task('dev', ['watch:css', 'watch:js', 'dev:server']) // Now if you run 'dev', the two 'watch' processes will begin automatically