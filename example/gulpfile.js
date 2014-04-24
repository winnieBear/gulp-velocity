// gulpfile.js
// Load plugins
var gulp = require('gulp');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var velocity = require('gulp-velocity');


var config = {
	'tpl_config':{
		"root":"./src/tpl/",// tpl root 
		"encoding":"utf-8",
		"macro":"./src/tpl/global-macro/macro.vm",//global macro defined file
		"dataPath":"./src/data/" // test data root path
	},
	'dist_tpl':'./src/tmp'
};



// tpl
gulp.task('tpl', function() {
	gulp.src('./src/tpl/**/*.vm')
	.pipe(plumber())
	.pipe(
		velocity(config['tpl_config'])
		.on('error', gutil.log)
	)
	.pipe(rename({
		extname:".html"
	}))
	.pipe(gulp.dest(config.dist_tpl));

});




gulp.task('default', ['tpl']);