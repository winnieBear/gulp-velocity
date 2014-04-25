// gulpfile.js
// Load plugins
var gulp = require('gulp');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var velocity = require('gulp-velocity');
var	connect = require('gulp-connect-multi')();


var config = {
	'tpl_config':{
		"root":"./src/tpl/",// tpl root 
		"encoding":"utf-8",
		"macro":"./src/tpl/global-macro/macro.vm",//global macro defined file
		"globalMacroPath":"./src/tpl/global-macro",
		"dataPath":"./src/data/" // test data root path
	},
	'tmp_output':'./src/tmp/'
};


//connect
gulp.task('connect', connect.server({
	root:[config.tmp_output],
	port:1337,
	lviereload:true
}));


// html
gulp.task('html', function() {
	gulp.src(config.tmp_output + '/*.html')
		.pipe(connect.reload());
});

// tpl
gulp.task('tpl', function() {
	gulp.src(config.tpl_config.root + '**/*.vm')
	.pipe(plumber())
	.pipe(
		velocity(config.tpl_config)
		.on('error', gutil.log)
	)
	.pipe(rename({
		extname:".html"
	}))
	.pipe(gulp.dest(config.tmp_output));

});





gulp.task('watch', function() {
	gulp.watch([config.tpl_config.root + '**/*.vm'], ['tpl']);
	gulp.watch([config.tmp_output + '/*.html'], ['html']);
});

//gulp.task('default', ['tpl']);
gulp.task('default', ['connect','watch']);
