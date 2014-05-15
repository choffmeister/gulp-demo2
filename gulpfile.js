var yargs = require('yargs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    gif = require('gulp-if'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect');

var config = {
  debug: !yargs.argv.dist,
  src: 'src/',
  dest: 'target/'
}

gulp.task('html', function () {
  return gulp.src(config.src + 'html/**/*.html')
    .pipe(gif(!config.debug, htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});

gulp.task('less', function () {
  return gulp.src(config.src + 'less/main.less')
    .pipe(less({ compress: !config.debug }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(config.src + 'js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gif(!config.debug, uglify()))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});

gulp.task('vendor:copy', function () {
  return gulp.src('vendor/**/*')
    .pipe(gulp.dest(config.dest + 'vendor'));
});

gulp.task('vendor:js', function () {
  var files = [
    'vendor/jquery/jquery.js',
    'vendor/bootstrap/js/bootstrap.js'
  ];

  return gulp.src(files)
    .pipe(concat('vendor.js'))
    .pipe(gif(!config.debug, uglify()))
    .pipe(gulp.dest(config.dest));
})

gulp.task('watch', function () {
  gulp.watch(config.src + 'html/**/*.html', ['html']);
  gulp.watch(config.src + 'less/main.less', ['less']);
  gulp.watch(config.src + 'js/**/*.js', ['js']);
});

gulp.task('connect', function () {
  connect.server({
    root: config.dest,
    livereload: true
  });
});

gulp.task('build', ['html', 'less', 'js', 'vendor:copy', 'vendor:js']);
gulp.task('default', ['build', 'connect', 'watch']);
