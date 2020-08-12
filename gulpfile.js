/* eslint-disable no-console */
'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const minifyCss    = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const gzip         = require('gulp-gzip');
const rename       = require('gulp-rename');
const combiner     = require('stream-combiner2');
const watchify     = require('watchify');
const browserify   = require('browserify');
const babelify     = require('babelify');
const vinylBuffer  = require('vinyl-buffer');
const source       = require('vinyl-source-stream');
const notify       = require('gulp-notify');
const del          = require('del');
const replace      = require('replace');
const notifier     = require('node-notifier');
const path         = require('path');
const tinyify      = require('tinyify');
// const mjml         = require('gulp-mjml');

const PROJECT_TITLE = 'React - Examples';
const DIST_JS = 'js';

const JS_PATHS = [
  './src/js',
  './src/js/components',
  './src/js/pages',
];

const jsVersion = (version) => {
  del([
    `${DIST_JS}/app*.js`,
    `${DIST_JS}/app*.map`,
    `${DIST_JS}/app*.gz`,
  ]);

  replace({
    regex: /js\/app\.\d{13,}\.js/g,
    replacement: `js/app.${version}.js`,
    paths: ['./index.html'],
    silent: true,
  });
};

function jsBuild() {
  process.env.NODE_ENV = 'production';

  const version = Date.now();
  jsVersion(version);

  const combined = combiner.obj([
    browserify('src/js/index.js', {paths: JS_PATHS})
      .transform(babelify)
      .plugin(tinyify, {flat: false})
      .bundle(),
    source(`app.${version}.js`),
    vinylBuffer(),
    gulp.dest(DIST_JS),
  ]);

  combined.on('error', err => {
    console.error(err.codeFrame);
  });

  combined.on('error', notify.onError({
    title: PROJECT_TITLE,
    message: "<%= error.filename %> (line=<%= error.loc.line %>, column=<%= error.loc.column %>)",
  }));

  return Promise.resolve(combined);
}

function gzipJs() {
  return gulp.src(`${DIST_JS}/app*.js`)
    .pipe(gzip())
    .pipe(gulp.dest(DIST_JS));
}

const DIST_CSS = 'css';

const cssVersion = (version) => {
  del([
    `${DIST_CSS}/app*.css`,
    `${DIST_CSS}/app*.gz`,
    `${DIST_CSS}/app*.map`,
  ]);

  replace({
    regex: /css\/app\.\d{13,}\.css/g,
    replacement: `css/app.${version}.css`,
    paths: ['./index.html'],
    silent: true,
  });
};

// DEV (no minification, sourcemapped)
function sassDev() {
  const version = Date.now();
  cssVersion(version);

  return gulp.src('./src/css/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',notify.onError({
      title: PROJECT_TITLE,
      message: 'Error: <%= error.message %>',
    })))
    .pipe(rename(`app.${version}.css`))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_CSS));
}

// PROD (minified, no sourcemap)
function sassBuild() {
  const version = Date.now();
  cssVersion(version);

  return gulp.src('./src/css/app.scss')
    .pipe(sass().on('error', notify.onError({
      title: PROJECT_TITLE,
      message: 'Error: <%= error.message %>',
    })))
    .pipe(autoprefixer())
    .pipe(minifyCss({zindex: false}))
    .pipe(rename(`app.${version}.css`))
    .pipe(gulp.dest(DIST_CSS));
}

function gzipCss() {
  return gulp.src(`${DIST_CSS}/app*.css`)
    .pipe(gzip())
    .pipe(gulp.dest(DIST_CSS));
}

function showMessage(message) {
  const icon = path.join(__dirname, '/img/react-logo.svg');

  notifier.notify({
    title: PROJECT_TITLE,
    message,
    icon,
  });
}

gulp.task('build',
  gulp.parallel(
    gulp.series(
      jsBuild,
      gzipJs,
    ),
    gulp.series(
      sassBuild,
      gzipCss,
    ),
    function complete(done) {
      showMessage('Build complete!');
      done();
    },
  ),
);

function watch() {
  const bundler = watchify(browserify('./src/js/index.js', {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
    paths: JS_PATHS,
  }).transform(babelify));

  function rebundle() {
    const version = Date.now();
    console.log(`* rebundle: ${version}`);

    jsVersion(version);

    const combined = combiner.obj([
      bundler.bundle(),
      source(`app.${version}.js`),
      vinylBuffer(),
      sourcemaps.init(),
      sourcemaps.write('./'),
      gulp.dest(DIST_JS),
    ]);

    combined.on('error', err => {
      console.error(err.message);
    });

    combined.on('error', notify.onError({
      title: PROJECT_TITLE,
      message: '<%= error.filename %> <%= error.loc.line %>, <%= error.loc.column %>',
    }));

    return combined;
  }

  bundler.on('update', rebundle);
  gulp.watch(['./src/css/*.scss'], sassDev);

  return rebundle();
}

gulp.task('default',
  gulp.parallel(
    sassDev,
    watch,
    function message(done) {
      showMessage('gulp running!');
      done();
    },
  ),
);
