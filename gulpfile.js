var gulp = require('gulp'); 
var watch = require('gulp-watch');
var htmlreplace = require('gulp-html-replace');
var eventstream = require("event-stream");
var gulpSequence = require('gulp-sequence');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gzip = require('gulp-gzip');
var insert = require('gulp-insert');

var version = '5.6.2'

var extensionSource = './bundle';
var extensionDestination = '../../../tropi/AppData/Roaming/Adobe/CEP/extensions/bodymovin';
gulp.task('watch-extension', function() {
    gulp.src(extensionSource + '/**/*', {base: extensionSource})
        .pipe(watch(extensionSource, {base: extensionSource}))
        .pipe(gulp.dest(extensionDestination));
});
gulp.task('copy-extension', function() {
    gulp.src(extensionSource+'/**/*')
        .pipe(gulp.dest(extensionDestination));
});

gulp.task('copy-extension-bundle', gulpSequence('copy-all', 'build-demo-data', 'replace-demo-data', 'create-bm', 'create-standalone', 'create-gzip', 'copy-manifest', 'copy-renderManager','copy-debug'))

gulp.task('copy-all', function() {
    return gulp.src(extensionSource+'/**/*')
        .pipe(gulp.dest('./build'));
});
gulp.task('create-bm', function() {
    return gulp.src('player/lottie.min.js')
        .pipe(rename('lottie.js'))
        .pipe(gulp.dest('build/assets/player'));
});
gulp.task('create-bm-extension-player', function() {
    return gulp.src('player/lottie.js')
        .pipe(rename('lottie.js'))
    	.pipe(insert.prepend('/* eslint-disable */var define = define || null;'))
        .pipe(gulp.dest('./src/'));
});
gulp.task('create-standalone', function() {
    return gulp.src('player/lottie.min.js')
    	.pipe(rename('standalone.js'))
        .pipe(gulp.dest('build/assets/player'));
});
gulp.task('create-gzip', function() {
    return gulp.src('player/lottie.min.js')
    	.pipe(rename('lottie.js'))
    	.pipe(gzip({ append: true }))
        .pipe(gulp.dest('build/assets/player'));
});

gulp.task('copy-manifest', function() {
    return gulp.src('bundle/CSXS/manifest.xml')
    	.pipe(replace(/(<Extension Id="com\.bodymovin\.bodymovin" Version=")(.+)(" \/>)/g,'$1'+version+'$3'))
    	.pipe(replace(/(<ExtensionManifest Version="5\.0" ExtensionBundleId="com\.bodymovin\.bodymovin" ExtensionBundleVersion=")(.+)(")/g,'$1'+version+'$3'))
    	.pipe(replace(/(<MainPath>\.\/)(index_dev.html)(<\/MainPath>)/g,'$1'+'index.html'+'$3'))
        .pipe(gulp.dest('build/CSXS/'));
});

gulp.task('copy-debug', function() {
    return gulp.src('bundle/.debug')
        .pipe(gulp.dest('build/'));
});

gulp.task('copy-renderManager', function() {
    return gulp.src('bundle/jsx/renderManager.jsx')
        //.pipe(replace(/(v : ')(.+)(',)/g,'$1'+version+'$3'))
    	.pipe(replace(/(version_number = ')(.+)(';)/g,'$1'+version+'$3'))
        .pipe(gulp.dest('build/jsx/'));
});

var demoBuiltData = '';
gulp.task('build-demo-data', function() {

    function saveToVar() {
        // you're going to receive Vinyl files as chunks
        function transform(file, cb) {
            // read and modify file contents
            demoBuiltData = String(file.contents);

            cb(null, file);
        }
        return eventstream.map(transform);
    }

    return gulp.src('player/lottie.min.js')
        .pipe(saveToVar());
});


gulp.task('replace-demo-data',['build-demo-data'], function() {
    //htmlreplace;
    return gulp.src('bundle/assets/player/demo.html')
        .pipe(htmlreplace({
            scripto:{
                src: demoBuiltData,
                tpl: '<!-- build:scripto --><script>%s</script><!-- endbuild -->'
            }
        }))
        .pipe(gulp.dest('build/assets/player/'));
});