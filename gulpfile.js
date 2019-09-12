var gulp = require('gulp'),
    shell = require('gulp-shell'),
    path = require('path'),
    s3 = require('gulp-s3'),
    minify = require('gulp-minify'),
    gzip = require('gulp-gzip'),
    cloudfront = require('gulp-cloudfront-invalidate'),
    AWS = require('aws-sdk'),
   replace = require('gulp-replace');

var envName = process.env.ENV || 'staging';

var envConfig = function () {
  return {
    production: {
      bucket: 'easyedu',
      distribution: process.env.EASYEDU_SCRIPTS_PRODUCTION_DISTRIBUTION,
      url: 'https://api.easyedu.co'
    },

    staging: {
      bucket: 'easyedu',
      distribution: process.env.EASYEDU_SCRIPTS_STAGING_DISTRIBUTION,
      url: 'https://easy-edu.herokuapp.com'
    }
  }[envName];
};

function s3Config () {
  return {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2',
    bucket: envConfig().bucket
  };
};

function cloudfrontConfig () {
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    distribution: envConfig().distribution
  };
};

gulp.task('deploy', shell.task([
  'gulp config',
  'gulp minify',
  'gulp compress',
  'gulp upload',
  'gulp invalidate'
]));

gulp.task('config', function() {
  return gulp.src(['enrollment.js'])
             .pipe(replace('http://localhost:9292', envConfig().url))
             .pipe(gulp.dest('dist/' + envName))
});

gulp.task('minify', function() {
  return gulp.src(['dist/' + envName + '/enrollment.js'])
    .pipe(minify({ ext: { min: '.js' }, noSource: true }))
    .pipe(gulp.dest('dist/' + envName))
});

gulp.task('compress', function() {
  return gulp.src(['dist/' + envName + '/enrollment.js'])
    .pipe(gzip({
      gzipOptions: {
        level: 9 // best compression
      }
    }))
    .pipe(gulp.dest('dist/' + envName));
});

gulp.task('upload', function() {
  var s3Options = {
    headers: {
      'Cache-Control': 'max-age=600, no-transform, public'
    },
    uploadPath: (envName + '/scripts'),
    gzippedOnly: true
  };

  return gulp.src(['dist/' + envName + '/enrollment.js.gz']).pipe(s3(s3Config(), s3Options));
});

gulp.task('invalidate', function() {
  var config = Object.assign({ paths: ['/enrollment.js'] }, cloudfrontConfig());
  return gulp.src('dist/' + envName + '/enrollment.js.gz').pipe(cloudfront(config));
});