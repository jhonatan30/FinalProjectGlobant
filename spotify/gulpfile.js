var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var clean  		 = require('gulp-clean');

gulp.task('hello', function () 
{
	 console.log('cool');
});


gulp.task('copyIndex', function () 
{
	gulp.src('app/*.html')
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));

	gulp.src('app/css/*.css')
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.reload({stream: true}));

	gulp.src('app/js/*.js')
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.reload({stream: true}));
	
	gulp.src('app/img/*.*')
	.pipe(gulp.dest('./build/img'))
	.pipe(browserSync.reload({stream: true}));
});


gulp.task('browserSync', function () 
{
	browserSync({
		server:{
			baseDir: './build'
		}
	}); 
});

gulp.task('watchFiles', function ()
{
	gulp.watch('app/*.html',['copyIndex'])
	gulp.watch('app/css/*.css',['copyIndex'])
	gulp.watch('app/js/*.js',['copyIndex'])
	gulp.watch('app/img/*.*',['copyIndex'])
});


gulp.task('clean', function () 
{
	return gulp.src('./build', {read: false})
		   .pipe(clean())
});

gulp.task('default',['clean', 'copyIndex', 'browserSync', 'watchFiles']);