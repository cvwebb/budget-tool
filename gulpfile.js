var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('sass', function(){
  return gulp.src('scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('css'))
});