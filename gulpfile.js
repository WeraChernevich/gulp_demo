const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');

const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
};


gulp.task('includeFiles', function(){
    return gulp.src('./src/*.html')
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('sass', function(){
    return gulp
    .src('./src/scss/*.scss')
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('copyImages', function(){
    return gulp.src('./src/img/**/*')
    .pipe(imagemin({verbose:true}))
    .pipe(gulp.dest('./dist/img/'))
});

gulp.task('js', function(){
    return gulp.src('./src/js/*.js')
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js/'))
})

const serverOption = {
    livereload: true,
    open: true
}

gulp.task('startServer', function(){
    return gulp.src('./dist/')
    .pipe(server(serverOption))
});

gulp.task('clean', function(done){
    if(fs.existsSync('./dist/')) {
        return gulp.src('./dist/', { read: false })
        .pipe(clean({ force: true }));
    }
    done();
});

gulp.task('watch', function(){
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('includeFiles'));
    gulp.watch('./src/img/**/*', gulp.parallel('copyImages'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
});

gulp.task('default', gulp.series('clean', gulp.parallel(
    'includeFiles', 'sass', 'copyImages', 'js'), gulp.parallel('startServer', 'watch')
));

