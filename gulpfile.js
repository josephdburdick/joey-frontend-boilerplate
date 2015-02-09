/* jshint node:true */
'use strict';
// generated on 2015-01-15
var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    $ = require('gulp-load-plugins')(),

    paths = {
      source: 'app',
      destination: 'dist',
      temp: '.tmp',
      scripts: ['app/scripts/**/*.js'],
      main_script: './app/scripts/app.js',
      scss: 'app/styles/main.scss'
    };

gulp.task('styles', function () {
  return gulp.src(paths.scss)
    .pipe($.plumber())
    .pipe($.sass({errLogToConsole: true, sourceMap: true}))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest(paths.temp + '/styles'));
    $.livereload.changed;
});

gulp.task('jshint', function () {
  return gulp.src(paths.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('js', ['jshint'], function () {
  return browserify(paths.main_script)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.temp + '/scripts'))
    .pipe($.streamify($.uglify()))
    .pipe(gulp.dest(paths.destination + '/scripts'));
    $.livereload.changed;
});

gulp.task('html', ['styles', 'js'], function () {
  var assets = $.useref.assets({searchPath: '{'+ paths.temp +','+ paths.source +'}'});

  return gulp.src(paths.source + '/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest(paths.destination));
});

gulp.task('images', function () {
  return gulp.src(paths.source + 'images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(paths.destination + '/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat(paths.source + 'fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.destination + '/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    paths.source + '*.*',
    '!' + paths.source + '/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest(paths.destination));
});

gulp.task('clean', require('del').bind(null, [paths.temp, paths.destination]));

gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic(paths.temp + ''))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src(paths.source + 'styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest(paths.source + 'styles'));

  gulp.src(paths.source + '*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    paths.source + '/*.html',
    paths.temp + '/styles/**/*.css',
    paths.source + '/scripts/**/*.js',
    paths.source + '/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch(paths.source + '/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['html', 'images', 'fonts', 'extras'], function () {
  return gulp.src(paths.destination + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
