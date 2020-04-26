const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');


// ----------  Server  ------------
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });


    gulp.watch('build/**/*').on('change', browserSync.reload)
});


// ----------  PUG compile  ------------
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('./source/templates/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
  });


// ----------  SASS compile  ------------
gulp.task('styles:compile', function () {
    return gulp.src('./source/styles/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
      }))
      .pipe(rename('main.min.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('build/css'));
  });

// ----------  SEPARATE IMAGE (spritesmith) ------------
gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('./source/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));
    
    spriteData.img.pipe(gulp.dest('build/images'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb()
    });


// ----------  Clean ------------
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
    });


// ----------  Copy fonts ------------
gulp.task('copy:fonts', function(){
    return gulp.src('./source/fonts/**/*.*')
      .pipe(gulp.dest('build/fonts'));
});


// ----------  Copy images ------------
gulp.task('copy:images', function(){
    return gulp.src('./source/images/**/*.*')
      .pipe(gulp.dest('build/images'));
});


// ----------  Copy  ------------
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


// ----------  WATCHERS  ------------
gulp.task('watch', function(){
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
})


// ----------  Default  ------------
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);