
// 控制进度条模块
// 1音乐总时间 2播放音乐，进度条运动 3左侧更新时间 4交互 拖拽进度条（位置时间更新，歌曲跳到当前的进度）

(function ($, root) {

    var frameId;
    var startTime;
// 总时间
    var dur;
// 按了暂停后，上一次时间的百分比  表示基于原来的基础上的百分比
    var lastPer = 0;

    // 音乐总时间
    function renderAllTime(time) {
        dur = time;
        time = formatTime(time)
        $('.all-time').html(time);
    }
    // 转换时间格式
    function formatTime(t) {
        // 获得的时间有小数，这里取整
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t % 60;
    //    处理成04:13的格式
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
    //    返回的时间格式xx:xx
        return m + ':' + s;
    }



    // 音乐开始播放
    function start(per) {
        // 音乐开始播放，先获取一个最初的时间，然后再不断获取当前的时间
        // 渲染的方法是：
        // 用当前的时间 - 最初的时间 = 一个时间段
        // 这个时间段 / 总时间 = 一个百分比，这个百分比 * 总时间 = 需要更新的时间
        // 当百分比 > 1，表示歌曲播完
        // 这里用到一个H5的定时器方法 requestAnimationFrame(函数名)，相当于每隔16.7毫秒执行一次
        // 取消cancleAnimationFrame(函数名)

        // 这里start没有传入per的话，就表示不是拖拽触发的，而是一开始触发的
        // 一开始触发的start，不存在上一次的百分比，所以直接赋值为最开始定义的lastper = 0
        lastPer = per === undefined ? lastPer : per;
        // !!每次开始，都要清除上一次的lastPer
        cancelAnimationFrame(frameId);
        // 最初的时间
        startTime = new Date().getTime();

        function frame() {
            // 不断获取当前的时间
            var nowTime = new Date().getTime();
            // 1s = 1000ms
            // 计算出百分比
            var per = lastPer + (nowTime - startTime) / (dur * 1000);
            if(per < 1) {
                // 百分比小于1，就更新
                update(per);
            }else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        // 外面先调用一次，达到无限循环的目的
        frame();
    }

    // 根据传过来的百分比per 进行渲染左侧时间和进度条的位置
    function update(p) {
        // 渲染时间
        var time = formatTime(p * dur)
        $('.cur-time').html(time);

        // 渲染进度条
        // 公式：进度条的百分比 = (当前百分比 + 当前总的百分比)   因为当前总的百分比是负数
        var perX = (p - 0.98) * 100 + '%';
        $('.pro-top').css({
            'transform': 'translateX(' + perX + ')'
        });
    }

    // 音乐暂停
    function stop() {
        cancelAnimationFrame(frameId);
        // 获取暂停的时间
        var stopTime = new Date().getTime();
        // 点击暂停后，上一次的百分比 = (点击暂停时的时间 - 最初的时间) / 总的时间
        lastPer += (stopTime - startTime) / (dur * 1000);
    }


//    暴露接口
    root.proControl = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update,
    }

})(window.Zepto, window.player || (window.player = {}))