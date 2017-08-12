// requirements
var del = require("del");
var path = require("path");

var gulp = require("gulp");
var babel = require("gulp-babel");
var pug = require("gulp-pug");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
// var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
var browserSync = require("browser-sync").create();
// var plumber = require('gulp-plumber');
// var gutil = require("gulp-util");

// config
var paths = {
  src: {
    pug: "src/**/*.pug",
    babel: "src/**/*.js",
    sass: "src/**/*.scss",
    static: "static/**/*"
  },
  dest: { // 
    html: "build",
    js: "build",
    css: "build",
    static: "build"
  }
};
var browsers = "> 1%, last 2 versions, IE >= 9, Firefox ESR"

// tasks

gulp.task("pug", function() {
  return gulp.src(paths.src.pug)
    .pipe(pug({
      pretty: true
    }))
    .on('error', notify.onError({
      message: "Pug error: <%= error.message %>",
      title: "Pug error"
    }))
    .pipe(gulp.dest(paths.dest.html))
    .pipe(browserSync.stream())
    .pipe(notify({
      title: "Success",
      message: "Compiled Pug file to HTML: <%= file.relative %>"
    }));
});

gulp.task("babel", function() {
  return gulp.src(paths.src.babel)
    // .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [
        ["env", {"targets": {"browsers": browsers}}]
      ]
    }))
    .on('error', notify.onError({
      message: "Babel error: <%= error.message %>",
      title: "Babel error"
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(browserSync.stream())
    .pipe(notify({
      title: "Success",
      message: "Compiled Babel file to JS: <%= file.relative %>"
    }));
});

gulp.task("sass", function() {
  return gulp.src(paths.src.sass)
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', notify.onError({
      message: "Sass error: <%= error.message %>",
      title: "Sass error"
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(autoprefixer({
      env: browsers
    }))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSync.stream())
    .pipe(notify({
      title: "Success",
      message: "Compiled Sass file to CSS: <%= file.relative %>"
    }));
});

gulp.task("static", function() {
  return gulp.src(paths.src.static)
    .pipe(gulp.dest(paths.dest.static))
    .pipe(browserSync.stream())
    .pipe(notify({
      title: "Success",
      message: "Copied static file: <%= file.relative %>"
    }));
});

// function makeWatcher(fileType) {
//   console.log(fileType, paths.src[fileType]);
//   gulp.watch(paths.src[fileType], [fileType])
//     // Special handler for deleting files
//     .on("change", (event) => {
//       if (event.type === 'deleted') {
//         var srcPath = path.relative(path.resolve(paths.src[fileType]), event.path);
//         var destPath = path.resolve(paths.dest[fileType], srcPath);
//         del.sync(destPath);
//         browserSync.reload()
//       }
//     });
// }

gulp.task("clean", function(done) {
  return del("build/**/*", done);
});

gulp.task("watch", function() {
  // ["pug", "babel", "sass", "static"].forEach(makeWatcher);
  gulp.watch(paths.src.pug, gulp.task("pug"));
  gulp.watch(paths.src.babel, gulp.task("babel"));
  gulp.watch(paths.src.sass, gulp.task("sass"));
  // gulp.watch(paths.src.static, ["static"]);
});

gulp.task("sync", function() {
  browserSync.init({
    server: {
      baseDir: paths.dest.html
    }
  });
});

gulp.task("build",
  gulp.series("clean",
    gulp.parallel("pug", "babel", "sass", "static")));

gulp.task("default", 
  gulp.series("build", "watch"));