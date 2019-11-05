(function ($, root) {

    // 创建一个构造函数，用来管理音频
    function AudioManager() {
        // 创建一个audio对象
        this.audio = new Audio();
        // audio的默认状态
        this.status = 'pause';
    };

    // 把音频的功能加在原型链上
    AudioManager.prototype = {
        // 开始
        play: function () {
            // audio属性，play()开始 pause()暂停 load()加载 currentTime跳到当前的时间
            this.audio.play();
            this.status = 'play';
        },
        // 暂停
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        // 加载音频
        getAudio: function (src) {
            // console.log(src);
            this.audio.src = src;
            // 音频加载但是不播放
            this.audio.load();
        },
        // 跳转到当前进度
        playTo: function (time) {
            this.audio.currentTime = time;
        }
    }


    // 有构造函数就要有new对象
    // 暴露接口
    root.audioManager = new AudioManager();

})(window.Zepto, window.player || (window.player = {}))