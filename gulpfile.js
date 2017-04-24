var gulp = require('gulp'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
cssNano = require('gulp-cssnano'),
concat = require('gulp-concat'),
plumber = require('gulp-plumber'),
uglify = require('gulp-uglify'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync'),
merge = require('merge-stream'),
del = require('del');

var config = {
  sassPath: './assets/sass/',
  jsPath: './assets/scripts/',
  publicPath: './public/',
  npmDir: './node_modules/',
};

gulp.task('copy', function() {
  var tachyons = gulp.src(config.npmDir + 'tachyons/src/**/*.css')
  .pipe(gulp.dest(config.sassPath + 'vendor/tachyons/'));

  var jquery = gulp.src(config.npmDir + 'jquery/dist/jquery.min.js')
  .pipe(gulp.dest(config.publicPath + 'scripts/'));

  var matchHeight = gulp.src(config.npmDir + 'jquery-match-height/dist/jquery.matchHeight-min.js')
  .pipe(gulp.dest(config.jsPath + 'vendor/'));

  return merge(
    tachyons,
    jquery,
    matchHeight
  );
});

gulp.task('build-css', function() {
  gulp.src([
    config.sassPath + 'app.scss',
  ])
  .pipe(plumber())
  .pipe(sass().on('error', gutil.log))
  .pipe(autoprefixer({
    browers: [
      'last 2 version',
      'IE 8',
    ]
  }))
  .pipe(cssNano().on('error', gutil.log))
  .pipe(concat('micro-finance.min.css'))
  .pipe(gulp.dest(config.publicPath + 'css/'))
  .pipe(browserSync.reload({
    stream: true,
  }));
});

gulp.task('build-js', function() {
  gulp.src([
    config.jsPath + 'main.js',
  ])
  .pipe(plumber())
  .pipe(uglify().on('error', gutil.log))
  .pipe(concat('micro-finance.min.js'))
  .pipe(gulp.dest(config.publicPath + 'scripts/'))
  .pipe(browserSync.reload({
    stream: true,
  }));
});

gulp.task('watch', function() {
  gulp.watch(config.jsPath + '*.js', ['build-js']);
  gulp.watch(config.sassPath + '**/*.scss', ['build-css']);
  gulp.watch(config.publicPath + "*.html", browserSync.reload);
  browserSync.init({
    injectChanges: true,
    server: "./public",
    open: false,
    domain: 'http://localhost:3000',
  });
});

gulp.task('clean', function() {
  return del([config.publicPath + 'css', config.publicPath + 'scripts', config.sassPath + 'vendor', config.jsPath + 'vendor']);
});

gulp.task('build', ['copy', 'build-css', 'build-js']);
gulp.task('default', ['watch']);
