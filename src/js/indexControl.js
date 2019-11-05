(function ($, root) {

    function Control(len) {
        this.index = 0;

        this.len = len;
    }

    Control.prototype = {

        // 这里做优化处理
        prev: function () {
            // if(this.index == 0) {
            //     this.index = len - 1;
            // }else {
            //     this.index --;
            // }
            return this.getIndex(-1);
        },
        next: function () {
            // if(this.index == len - 1) {
            //     this.index = 0;
            // }else {
            //     this.index ++;
            // }
            return this.getIndex(1);
        },
        getIndex: function (val) {
            // 当前的索引
            var index = this.index;
            // 数据总长度
            var len = this.len;
            // 改变后的索引
            var curIndex;
            curIndex = (index + val + len) % len;
            // 计算完改变后的索引以后，要把改变后的索引变为当前的索引
            this.index = curIndex;
            return curIndex;
        }
    }

//    暴露接口
    root.control = Control;

})(window.Zepto, window.player || (window.player = {}));