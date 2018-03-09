/**
 * @file print
 * Created by haner on 2018/3/9.
 * @brief
 */


//TODO 参考 https://github.com/mqyqingfeng/AutoType 思路很好，感谢作者。

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
function replaceStr(str) {
    str = str.toLowerCase();
    var reg = /\b(\w)|\s(\w)/g;
    return str.replace(reg, function (m) {
        return m.toUpperCase()
    });
}

/**
 * 判断某个对象是否有指定的className
 * @param ele
 * @param cls
 */
function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * 给指定对象添加className
 * @param ele
 * @param cls
 */
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}


var Print = function (container, data) {
    this.data = data;
    this.container = container;

    this.handlers = [];
    this.handleIndex = 0;

    this.contents = [];


    this.gather(data).run();
};


Print.prototype = {
    constructor: Print,

    gather: function () {
        //组装所执行的队列
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            var handle = this['print' + replaceStr(item.type)];
            delete item.type;

            this.handlers.push({
                handle: handle,
                data: item
            });
        }
        return this;
    },

    //开始执行
    run: function () {
        this.handleIndex = 0;
        this.next();
    },

    next: function () {
        if (this.handleIndex < this.handlers.length) {
            var item = this.handlers[(this.handleIndex++)];
            item && item.handle.call(this,item.data, this.next.bind(this));
            return;
        }
        console.log('任务执行完成！');
        addClass(this.container,'end');
    },


    printText: function (data, next) {
        var texts = data.text.split('');
        var idx = 0, timer = null,self = this;

        function start() {
            if (idx < texts.length) {
                timer = setTimeout(function () {
                    self.contents.push(texts[idx]);
                    self.render();
                    idx++;
                    start();
                }, data.time || 200)
            } else {
                clearTimeout(timer);
                timer = null;
                next();
            }
        }
        start();
    },

    printImg: function (next, text, timer) {

    },

    printBr: function (next, text, timer) {

    },

    printDelete: function () {

    },

    printWait: function () {

    },

    render: function () {
        console.log(this.contents.join(''));
        this.container.innerHTML = this.contents.join('');
    }
};


//输出的所有动作
Print.ACTION = {TEXT: 'text', WAIT: 'wait', DELETE: 'delete', BR: 'br', IMG: 'img'};


// 打字数据格式
var arr = [
    {type: Print.ACTION.TEXT, text: '哈喽，陌生人，很高兴你能打开这个网页........',time:100},
    {type: Print.ACTION.TEXT, text: '嗯嗯，这个打字插件 还没有写完，很简陋，可以各发己见，帮忙修改修改~~~~',time:100},
    {type: Print.ACTION.TEXT, text: '目前仅能打印文字，待开发【退格，图片，延迟等待，等等 项目参考：https://github.com/mqyqingfeng/AutoType】',time:100},
    // {type: Print.ACTION.WAIT, time: 900},
    // {type: Print.ACTION.DELETE, num: 4},
    // {type: Print.ACTION.TEXT, text: '，嗯!'},
    // {type: Print.ACTION.BR, num: 3},
    // {type: Print.ACTION.TEXT, text: '她温柔美丽，善良大方'},
    // {type: Print.ACTION.TEXT, text: '，国色天香，沉鱼落雁，如花似玉，闭月羞花，贤良淑德，花容月貌，秋水伊人，一笑倾城，冰清玉洁，娇俏佳人，朱颜玉润，玉骨冰肌，窈窕淑女，美若天仙，一顾倾城，才智国人，出水芙蓉，阿娇金屋，闭月羞花，逞娇呈美，春暖花香，春色满园……', time: 50},
    // {type: Print.ACTION.BR, num: 2},
    // {type: Print.ACTION.TEXT, text: '给你们看张她的照片吧~'},
    // {type: Print.ACTION.WAIT, time: 900},
    // {type: Print.ACTION.IMG, src: 'img/bishi2.jpg', id: "cat", style: "width: 50%;display: block;margin-left: auto;margin-right: auto;margin-top: 20px;margin-bottom: 20px;"},
    // {type: Print.ACTION.WAIT, time: 900},
    // {type: Print.ACTION.TEXT, text: '是不是美美哒~'}
];


new Print(document.getElementById('info'),arr);