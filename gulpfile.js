var gulp = require("gulp");

// gulp的四个主要的API
// gulp.src() 输入路径
// gulp.dest() 用pipe传输文件过来
// gulp.task() 创建任务
// gulp.watch() 监听

// 压缩html   gulp-htmlclean
var htmlClean = require("gulp-htmlclean");

// 压缩图片 gulp-imagemin
var imageMin = require("gulp-imagemin");

// 压缩js gulp-uglify
var uglify = require("gulp-uglify");

// 去掉js中的调试语句   gulp-strip-debug
var debug = require("gulp-strip-debug");

// 处理less 转化成css  gulp-less
var less = require("gulp-less");

// 压缩CSS  gulp-clean-css
var cleanCss = require("gulp-clean-css");

// 开启本地服务器代理
var connect = require("gulp-connect");

// 自动添加前缀  gulp-postcss, autoprefixer
// autoprefixer以参数的形式放到gulp-postcss里面
var postCss = require("gulp-postcss");
var autoPrefixer = require("autoprefixer");



var folder = {
    src: "src/",
    dist: "dist/"
}

// 设置当前的环境变量 $ export NODE_ENV=production/development

// 获取到当前的环境变量，生产环境压缩production，开发环境不压缩development
// 这里返回布尔值
var devMod = process.env.NODE_ENV == "development";
console.log(devMod);

// ---------------------------------------------这里是创建任务---------------------------------------------------------------
// 创建任务
gulp.task("html", function () {
    // 任务的输入路径  先把html文件夹里的所有文件取出来，然后变成文件流，放到管道里进行处理
    var page = gulp.src(folder.src + "html/*")
    //  自动刷新，当它有变化的时候就执行reload()
        .pipe(connect.reload());
    // 在输出前压缩，如果不是开发环境就压缩
    if(!devMod) {
        page.pipe(htmlClean())
    }
    // 传输文件过来，写入路径
    page.pipe(gulp.dest(folder.dist + "html/"));
});

// 处理图片
gulp.task("image", function () {
    gulp.src(folder.src + "image/*")
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + "image/"));
})

// 同时对css和js处理
gulp.task("css", function () {
    var page = gulp.src(folder.src + "css/*")
    // 匹配到css文件后，先将less转换成css文件，执行postcss自动添加前缀，压缩css
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postCss([autoPrefixer()]));
    if(!devMod) {
        page.pipe(cleanCss())
    }
    page.pipe(gulp.dest(folder.dist + "css/"));
});
gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload());
    if(!devMod) {
        page.pipe(debug())
        .pipe(uglify())

    }
    page.pipe(gulp.dest(folder.dist + "js/"));
});

// 创建开启服务器的任务
gulp.task("server", function () {
    connect.server({
        // 更改端口
        port: "3333",
        // 开启自动刷新
        livereload: true
    });
})

// 先开启监听任务watch  监听完之后就会执行后面的任务
// 监听folder下的src文件夹下的html文件夹的所有文件，当它被改变就去触发html任务
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"],);
})

// ---------------------------------------------这里是创建任务---------------------------------------------------------------



// 创建任务  任务名(default, 默认任务，一开始就默认执行) 后面是任务名
gulp.task("default",["html", "image", "js", "css", "server", "watch"]);