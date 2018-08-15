var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    del = require('del');

var onError = function(error) {
    return error.massageOriginal ?
    "File: " + error.file + 
    "\rAt: " + error.line + error.column +
    "\r" + error.massageOriginal :
    error;
}

gulp.task('sass', function(){
    return gulp.src('app/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber({
        errorHandler : notify.onError({
            title: 'SCSS error', 
            massage: onError
        })
    }))
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
        }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(notify({message: 'SCSS completed', onLast: true}))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function(){
    browserSync({
        server:{
            baseDir: 'app'
        }
    });
});

gulp.task('watch', ['browser-sync', 'sass'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('build', ['sass'], function() {
    var buildCss = gulp.src([
        'app/css/style.css'
    ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});