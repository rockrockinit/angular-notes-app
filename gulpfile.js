var gulp = require('gulp');

// define plug-ins
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var cssnano = require('gulp-cssnano');
var flatten = require('gulp-flatten');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');
var bower = require('main-bower-files');

gulp.task('build', function () {
  // app js
  gulp.src(['src/common.js', 'src/app.js', 'src/**/*.js', 'src/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(annotate())
    .pipe(uglify())
    .pipe(gulp.dest('js'));
    
  // app css
  gulp.src(['css/app.css'])
    .pipe(concat('app.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('css'));
    
  // bower js
  gulp.src([
    'bower_components/crypto-js/build/rollups/aes.js',
    'bower_components/crypto-js/build/rollups/md5.js',
    'bower_components/firebase/firebase.js',
    'bower_components/moment/moment.js',
    'bower_components/underscore/underscore.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-material-icons/angular-material-icons.js',
    'bower_components/angular-contenteditable/angular-contenteditable.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-messages/angular-messages.js',
    'bower_components/angular-material/angular-material.js'])
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
    
  // bower css
  gulp.src(['bower_components/angular-material/angular-material.css'])
    .pipe(concat('bower.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('css'));
    
  // bower fonts
  gulp.src(bower())
    .pipe(filter(['*.eot', '*.woff', '*.svg', '*.ttf']))
    .pipe(flatten())
    .pipe(gulp.dest('fonts'));
});
