var gulp = require('gulp');
const fs = require('fs');
var del = require('del');

gulp.task('clean', function () {
  return del(['dist/**', '!dist', 'lib/**', '!lib'], { force: true });
});
