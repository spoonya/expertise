const gulp = require('gulp');

module.exports = function dosc() {
  return gulp.src('src/docs/*').pipe(gulp.dest('build/docs'));
};
