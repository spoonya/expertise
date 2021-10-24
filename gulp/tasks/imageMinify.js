const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports = function imageMinify() {
  return gulp
    .src('src/images/**/*.{gif,png,jpg,jpeg,webp}')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({
          quality: 75,
          progressive: true
        }),
        imagemin.optipng({ optimizationLevel: 4 })
      ])
    )
    .pipe(gulp.dest('build/images'));
};
