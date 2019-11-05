// 实现页面渲染  img + info + like-btn

(function ($, root) {

    // 渲染歌曲图片
    function renderImage(src) {
        // 创建一个image对象
        var img = new Image();
        img.src = src;
        // 当图片加载进来的时候
        img.onload = function () {
            $('.img-box img').attr('src', src);
            // 这里用到高斯模糊的方法，参数(传入的图片, 放在哪里)
            root.blurImg(img, $('body'));
        }
    }

    // 渲染歌曲信息
    function renderInfo(data) {
        var str = '<div class="song-name">' + data.song + '</div>\n' +
            '<div class="singer-name">' + data.singer + '</div>\n' +
            '<div class="album-name">' + data.album + '</div>';
        $('.song-info').html(str);

    }

    // 渲染是否喜欢
    function renderIsLike(data) {
        if(data.isLike) {
            $('.like').addClass('liking');
        }else {
            $('.like').removeClass('liking');
        }
    }

    // 暴露接口出去
    root.render = function (data) {
        renderImage(data.image);
        renderInfo(data);
        renderIsLike(data);
    }

// 这里和jq原理一样  传入window下的player，没有就在window下创建player对象
})(window.Zepto, window.player || (window.player = {}));