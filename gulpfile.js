var gulp = require('gulp'),
    babel = require('gulp-babel'),
    run = require('gulp-run'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del')

gulp.task('scripts', function() {
    return gulp.src('./assets/js/app.js')
        .pipe(babel())
        .pipe(rename('index.js'))
        .pipe(gulp.dest('./'))
})

gulp.task('styles', function() {
    return sass('assets/sass/app.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }))
})

gulp.task('run', ['default'], function() {
    return run('electron .').exec()
})

gulp.task('watch', ['styles'], function (cb) {
    // watch('assets/js/**/*.js', function () {
    //     gulp.run('scripts')
    // })

    watch('assets/scss/**/*.scss', function () {
        gulp.run('styles')
    })
})

gulp.task('default', ['styles'])
