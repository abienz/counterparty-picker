var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var nib = require('nib');

gulp.task('compress', function () {
  gulp.src('stylus/*.styl')
    .pipe(stylus({
      use: nib(),
      compress: true
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function(){
  gulp.watch('stylus/*.styl', ['compress']);
});

gulp.task('default', ['watch']);