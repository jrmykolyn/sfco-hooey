/* -------------------------------------------------- */
/* REQUIRE MODULES */
/* -------------------------------------------------- */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


/* -------------------------------------------------- */
/* CONFIGURE MODULES */
/* -------------------------------------------------- */
var uglify_opts = {
	mangle: true
};


/* -------------------------------------------------- */
/* DECLARE TASKS */
/* -------------------------------------------------- */
gulp.task('default', ['uglify'], function() {
	
});

gulp.task('uglify', function() {
	return gulp.src('./js/src/*.js')
		.pipe(uglify(uglify_opts))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./js/dist/'));
});