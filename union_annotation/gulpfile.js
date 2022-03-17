const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');
const replace = require('gulp-replace');

gulp.task('default', () => {
  return gulp
    .src('./build/index.html')
    .pipe(replace("/static", "https://nlp.biu.ac.il/~hirsche5/union_annotation/union_annotation_build/static"))
//    .pipe(replace('.js" custom></script>', '.js" custom inline></script>'))
//    .pipe(replace('rel="stylesheet" custom>', 'rel="stylesheet" custom inline>'))
//    .pipe(replace('rel="manifest" custom>', 'rel="manifest" custom inline>'))
//    .pipe(
//      inlinesource({
//        compress: false,
//        ignore: ['png'],
//      })
//    )
    .pipe(gulp.dest('./build'));
});