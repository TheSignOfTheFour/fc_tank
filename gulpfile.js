var gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  qunit = require('gulp-qunit'),
  coffeelint = require('gulp-coffeelint');

var paths = {
  coffee_scripts: ['src/*.coffee'],
  coffee_file: ['build/coffee/*.coffee']
};

gulp.task('build', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.coffee_scripts)
    .pipe(concat('all.coffee'))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(gulp.dest('build/coffee'))
    .pipe(coffee({bare: true}))
//    .pipe(uglify())
//    .pipe(concat('all.js'))
    .pipe(gulp.dest('test/js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('test_js', function () {
  gulp.src('test/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(concat('test.js'))
    .pipe(gulp.dest('test/js'))
});

gulp.task('qunit', function() {
  return gulp.src('test/index.html')
    .pipe(qunit());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.coffee_scripts, ['build']);
});

gulp.task('test', ['build', 'test_js', 'qunit']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'watch']);