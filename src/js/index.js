// 主要功能
// 歌曲信息＋图片的渲染
// 图片旋转
// 点击按钮
// 歌曲的播放与暂停  切歌
// 进度条的运动与拖拽
// 列表切歌

var root = window.player;
// 初始的索引是第0个
// var nowIndex = 0;
var dataList;
var len;
// 音频模块
var audio = root.audioManager;
console.log(audio);
// 控制索引模块
var control;
// 控制进度条模块
var proControl = root.proControl;
var timer;

// 获取数据
function getData(url) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            console.log(data);
            dataList = data;
            len = dataList.length;
            // 这里传入的len是上面这个len
            control = new root.control(len);
            // 渲染第一个数据到页面
            root.render(dataList[0]);
            // 拿到数据，调用音频模块，加载音乐，但是不播放
            audio.getAudio(dataList[0].audio);
            proControl.renderAllTime(dataList[0].duration);
            bindEvent();
            bindTouch();
        },
        error: function () {
            console.log('error');
        }
    })
}

function bindEvent() {

    // 这里做代码共同的优化处理 next和prev
    // 处理的都是页面更新的事件
    $('body').on('play-change', function (e, index) {
        // 调用音频模块，加载当前索引所对应的音乐
        audio.getAudio(dataList[index].audio);
        // 渲染当前音乐
        root.render(dataList[index]);
        // 渲染右边总的时间
        proControl.renderAllTime(dataList[index].duration);
        // 如果在播放状态，点击了切换，切换后，还是让它处于播放状态
        if(audio.status == 'play') {
            audio.play();
            rotate(0);
        }
        // 这里做处理：
        // 点击了上/下一首，处于暂停状态，把角度变为0，从0开始旋转
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            'transform': 'rotateZ(0deg)'
        });
    })

    // 上一首下一首歌的切换事件
    $('.prev').on('click', function () {
        // 这里优化，改成调用control里的prev功能
        var i = control.prev();
        $('body').trigger('play-change', i);
        proControl.start(0);
        if(audio.status == 'pause') {
            audio.pause();
            proControl.stop();
        }
    });
    $('.next').on('click', function () {
        var i = control.next();
        $('body').trigger('play-change', i);
        proControl.start(0);
        if(audio.status == 'pause') {
            audio.pause();
            proControl.stop();
        }
    });
    // 开始暂停按钮
    $('.play').on('click', function () {
        // 如果当前是暂停，就让它开始
        if(audio.status == 'pause') {
            console.log('a');
            // 调用音频模块
            audio.play();
            // 开始播放，获取到属性上的deg，然后调用rotate进行旋转
            var deg = $('.img-box').attr('data-deg');
            proControl.start();
            console.log(deg);
            rotate(deg);
            audio.status = 'play';
        }else {
            audio.pause();
            proControl.stop();
            clearInterval(timer);
            console.log('123');
        }
        $('.play').toggleClass('playing');
    })

}

// 图片旋转功能
function rotate(deg) {
    clearInterval(timer);
    // 因为拿到的data-deg是字符串，这里转为数字
    deg = +deg;
    timer = setInterval(function () {
        deg += 2;
        // 把角度保存在img-box标签的属性上
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition:': 'all 1s ease-in'
        })
    }, 100);
}

// 拖拽事件 touchstart  touchmove  touchend
function bindTouch() {
    // 这里先拿到进度条的宽度和左侧的坐标
    var left = $('.pro-wrap').offset().left,
        width = $('.pro-wrap').offset().width;
    // 拖拽事件绑定在圆点上
    $('.spot').on('touchstart', function () {
        // 拖拽开始的时候，让音乐暂停
        root.proControl.stop();
    }).on('touchmove', function (e) {
        // 获取的这个坐标是基于视口的坐标
        // 用x - 进度条的left值 再 / 总长度，就可以得到当前的百分比
        var x = Math.round(e.changedTouches[0].clientX);
        console.log(x);
        var per = (x - left) / width;

        // 移动的时候更新进度条和左侧的时间
        if(per > 0 && per <= 0.98) {
            root.proControl.update(per);
        }

    }).on('touchend', function (e) {

        // 抬起鼠标之后，需要将歌曲进度跳转到当前的进度
        var x = Math.round(e.changedTouches[0].clientX);
        console.log(x);
        var per = (x - left) / width;

        if(per > 0 && per <= 0.98) {
            // 用当前百分比 * 歌曲总时间的百分比
            // control.index 拿到当前歌的索引
            var time = per * dataList[control.index].duration;
            $('.play').addClass('playing');
            audio.playTo(time);
            audio.play();
            audio.status = 'play';
            root.proControl.start(per);
        }


    });
}

getData('../mock/data.json');


