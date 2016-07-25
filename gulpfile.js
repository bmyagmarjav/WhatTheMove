'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('nodemon');

gulp.task('nodemon', function () {
    return nodemon({
        // expressjs server
        script: 'server.js',
        // watch core server file(s) that require server restart on change
        watch: ['server.js']
    })
});

gulp.task('browser-sync', ['nodemon'], function () {
    browserSync({
        // informs browser-sync to proxy our expressjs server
        proxy: 'http://localhost:3000',
        // informs browser-sync to use the following port for the proxied app
        port: 5000,
        // open the proxied app in chrome
        browser: ['google-chrome']
    });
});

gulp.task('js',  function () {
    return gulp.src('app/**/*.js')
});

gulp.task('css', function () {
    return gulp.src('app/**/*.css')
    .pipe(browserSync.reload({ stream: true }));
})

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch('app/**/*.js',   ['js', browserSync.reload]);
    gulp.watch('app/**/*.css',  ['css']);
    gulp.watch('app/*.html', ['bs-reload']);
});
