/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Calendar = __webpack_require__(1);
new Calendar();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// jshint unused:false

__webpack_require__(2);


/**
 * 模块处理
 */
(function (win, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        win.Calendar = factory();
    }
})(this, function () {

    /**
     * 构造器
     * @param opt
     * @constructor
     */
    function Calendar(opt) {
        this.defaults = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            holiday: {
                '2.23': '2B青年节',
                '3.8': '妇女节',
                '5.1': '黄金周^_~',
                '5.4': '青年节' //balabala。。。。
            },
            weekendTipMsg: '马上放假~',
            workTipMsg: '工作日',
            currentDate: new Date(),
            maxDate: 2020,
            container: document.body
        };

        this.init(opt);
    }

    var proty = Calendar.prototype;

    /**
     * 初始化
     */
    proty.init = function (opt) {

        if (typeof opt === 'string') {
            this.defaults.container = this.dom.byId(opt);
        } else {
            Tools.extend(this.defaults, opt);
            if (opt && opt.container) {
                this.defaults.container = this.dom.byId(opt.container);
            }
        }

        this.task = {}; //记录所创建任务
        this.selectYearId = Math.random().toString(36).substring(3, 8);//年 id
        this.selectMonthId = Math.random().toString(36).substring(3, 8);//月 id
        this.dateContainerId = Math.random().toString(36).substring(3, 8); //日期主容器 id

        if (typeof this.defaults.currentDate === 'string') {
            //todo IE8 兼容问题
            var arr = this.defaults.currentDate.split("-");
            this.defaults.currentDate = new Date(Date.UTC(+arr[0], +arr[1] - 1, +arr[2]));
        }

        this.createCalendar();
    };


    /**
     * 创建日历容器
     */
    proty.createCalendar = function () {
        this.calendar = this.dom.create('div');
        this.calendar.className = 'calendar';

        //添加年月
        this.createYearAndMonth();

        //添加日历头
        this.createCalendarHeader();

        //添加日期,默认为当前日期
        this.createDate();

        // innerHTML = ''; can't work in IE8 ....
        this.dom.removeAllChild(this.defaults.container);

        this.defaults.container.appendChild(this.calendar);

        this.bindEvent();
    };

    /**
     * 创建年份,月份容器
     */
    proty.createYearAndMonth = function () {
        var selectYearAndMonthAreaDom = this.dom.create('div');
        selectYearAndMonthAreaDom.className = 'selectArea';
        selectYearAndMonthAreaDom.appendChild(this.createYear());
        selectYearAndMonthAreaDom.appendChild(this.createMonth());
        this.calendar.appendChild(selectYearAndMonthAreaDom);
    };

    /**
     * 创建日历头部星期
     * @returns {string}
     */
    proty.createCalendarHeader = function () {
        var calendarHeader = this.dom.create('ul'),
            weekText = this.defaults.dayNames;

        calendarHeader.className = 'header';
        for (var i = 0; i < weekText.length; i++) {
            var oLi = this.dom.create('li');
            oLi.innerText = weekText[i];
            calendarHeader.appendChild(oLi);
        }
        this.calendar.appendChild(calendarHeader);
    };

    /**
     * 创建年份
     */
    proty.createYear = function () {
        var year = this.dom.create('select');

        this.dom.setAttr(year, 'id', this.selectYearId);
        year.className = 'year-list';

        //生成年份
        for (var i = 1990; i <= (this.defaults.maxDate || this.defaults.currentDate.getFullYear()); i++) {
            var o = this.dom.create("option"), t = document.createTextNode(i);
            o.setAttribute("value", i);
            o.appendChild(t);
            if (i === this.defaults.currentDate.getFullYear()) {
                o.setAttribute('selected', true);
            }
            year.appendChild(o);
        }
        return year;
    };

    /**
     * 创建月份
     */
    proty.createMonth = function () {
        var month = this.dom.create('ul'),
            monthArr = this.defaults.monthNames;

        month.setAttribute('id', 'month');
        month.className = 'month-list';
        this.dom.setAttr(month, 'id', this.selectMonthId);

        for (var i = 0; i < monthArr.length; i++) {
            var oLi = this.dom.create('li');
            oLi.innerText = monthArr[i];
            this.dom.setAttr(oLi, 'value', i);
            if (i === this.defaults.currentDate.getMonth()) {
                oLi.className = 'active';
            }
            month.appendChild(oLi);
        }

        return month;
    };

    /**
     * 创建日期
     */
    proty.createDate = function () {
        var table = this.dom.byId(this.dateContainerId) || this.dom.create('table');
        table.className = 'main';
        table.setAttribute('cellspacing', 8);
        table.setAttribute('id', this.dateContainerId);
        this.dom.removeAllChild(table);
        var arr = this.inserData();

        var index = 0;
        for (var j = 1; j <= Math.ceil(arr.length / 7); j++) {
            var oTr = this.dom.create('tr');
            for (var i = 1; i < 8; i++) {
                var data = arr[index++],
                    oTd = this.dom.create('td'),
                    date = this.dom.create('span');

                date.className = 'date';
                oTd.className = this.processTdClass(data);
                date.innerText = data.str;
                oTd.appendChild(date);
                this.dom.setAttr(oTd, 'ymd', data.date);
                this.processTd(oTd, data);
                oTr.appendChild(oTd);
            }
            table.appendChild(oTr);
        }

        this.calendar.appendChild(table);

    };

    /**
     * 插入日历数据
     * 思路 前一月的数组 + 当前月数组 + 下一个月数组
     * @param d 日期
     */
    proty.inserData = function (d) {
        var currentDate = d || this.defaults.currentDate, _this = this;
        var first_day_of_current_month = this.getFirstDay(currentDate);

        var current_month = {
            //前一个月的偏差值
            preMonthOffset: first_day_of_current_month ? first_day_of_current_month : 7 - first_day_of_current_month,
            endDate: this.getDaysOfMonth(currentDate)
            //后一个月偏差值 : a.硬编码计算(至少大于当前月份所能否显示列数) b.Math.ceil((前一个月的偏差量 + 当前月的天数动态计算)/7)*7 - (前一个月的偏差量 + 当前月的天数动态计算);
        };

        //获取前一个月所显示的数据
        var tempDate = null;
        var preMonth = Tools.createArr(current_month.preMonthOffset).map(function () {
            if (!tempDate) {
                //默认为当前月的第一天
                tempDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
            }
            tempDate = Tools.addDayNum(tempDate, -1); //-1 计算前一天 1 后一天

            return _this.processDate(tempDate, currentDate, true);
        }).reverse();


        tempDate = null;
        //获取当前月数据
        var currentMonth = Tools.createArr(current_month.endDate).map(function () {
            if (!tempDate) {
                tempDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
            } else {
                tempDate = Tools.addDayNum(tempDate, 1);
            }

            return _this.processDate(tempDate, currentDate, false);
        });

        tempDate = null;
        //计算总行数
        var rowNum = Math.ceil((current_month.endDate + preMonth.length) / 7);

        //获取下一个月可显示数据 总cell数 -  (前一个月 + 当前月)
        var nextMonth = Tools.createArr(7 * rowNum - (current_month.endDate + preMonth.length)).map(function () {
            if (!tempDate) {
                tempDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
            } else {
                tempDate = Tools.addDayNum(tempDate, 1);
            }

            return _this.processDate(tempDate, currentDate, true);
        });

        return preMonth.concat(currentMonth, nextMonth);
    };

    /**
     * 绑定事件
     */
    proty.bindEvent = function () {
        var year = this.dom.byId(this.selectYearId),
            month = this.dom.byId(this.selectMonthId),
            calendarTable = this.dom.byId(this.dateContainerId),
            _this = this;

        //选择年
        Tools.addEve(year, 'change', function (e) {
            _this.updateView();
        });

        //选择月
        Tools.addEve(month, 'click', function (e) {
            //事件绑定在 UL 上!~
            if((e.target || e.srcElement).nodeName!=='LI'){return;}//IE 事件源兼容

            var allChild = month.childNodes;
            //remove Class
            for (var i = 0; i < allChild.length; i++) {
                allChild[i].className = '';
            }
            (e.target || e.srcElement).className = 'active';
            _this.updateView();
        });

        //创建任务事件
        Tools.addEve(calendarTable, 'click', function (e) {
            _this.createTask((e.target || e.srcElement));
        });
    };

    /**
     * 更新日历
     */
    proty.updateView = function () {
        var year = this.dom.byId(this.selectYearId),
            month = this.dom.byId(this.selectMonthId);
        var monthVal = this.defaults.currentDate.getMonth();
        for (var i = 0; i < month.childNodes.length; i++) {
            if (Tools.hasClass(month.childNodes[i], 'active')) {
                monthVal = this.dom.getAttr(month.childNodes[i], 'value');
                break;
            }
        }
        this.defaults.currentDate = new Date(Date.UTC(year.value, +monthVal, this.defaults.currentDate.getDate()));

        this.createDate();
    };

    /**
     * 根据月份获取当前日历行数
     * @param date
     * @returns {number}
     */
    proty.getCalendarColNumsByMonth = function (date) {
        return Math.ceil(this.getDaysOfMonth(date) / 7);
    };


    /**
     * 获取月份的天数
     * @param date
     * @returns {number}
     * http://www.w3schools.com/jsref/jsref_setdate.asp
     * 0 will result in the last day of the previous month
     */
    proty.getDaysOfMonth = function (date) {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    };

    /**
     * 获取一年中某一月份的第一天为周几
     * @param date
     * @returns {number}
     */
    proty.getFirstDay = function (date) {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)).getDay();
    };

    /**
     * 日期数据处理
     * 是否为节假日,周末等等...
     * 是否设有任务...
     * @param date
     * @param currentDate
     * @param disabled
     */
    proty.processDate = function (date, currentDate, disabled) {
        //优化
        var d = new Date();
        return {
            str: Tools.formatDate(date.getTime(), 10),//页面显示数据
            current: date.getTime() === new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())).getTime(), //是否为今天
            date: Tools.formatDate(date.getTime(), 6),//各个时间
            isWeekend: (date.getDay() === 0 || date.getDay() === 6),//是否是周末
            holiday: this.isHoliday(date),//是否为节假日
            disabled: disabled, //是否高亮显示标示,
            task: this.getTask(date),//当前日期的任务,
            isShowRightTopMsg: {
                isShow: ~~(Math.random() * 2),
                msg: ['请病假', '头晕', '无聊', '-_-||'][~~(Math.random() * 4)]
            }
        };
    };

    /**
     * 日期单独样式处理
     */
    proty.processTdClass = function (data) {
        var className = 'day';

        //周末
        if (data.isWeekend) {
            className += ' week';
        }

        //节假日
        if (data.holiday && data.holiday.isHoliday) {
            className += ' holiday';
        }

        //当天
        if(data.current){
            className += ' active';
        }

        //当前月
        if(data.disabled){
            className += ' disabled';
        }
        return className;
    };

    /**
     * 处理 TD 中的 DOM
     * 添加节假日,任务...
     * @param td
     * @param data
     */
    proty.processTd = function (td, data) {
        //节假日
        if (data.holiday.isHoliday) {
            this.createTdLabel(td, data.holiday.text);
        }

        //工作日
        if (!data.isWeekend && !data.holiday.isHoliday) {
            var bg = ['#f3faf0', '#ffeee6', '#eaf8fe', '#fff7e6', '#87d068'][~~(Math.random() * 5)];
            this.createTdLabel(td, data.isShowRightTopMsg.isShow ? data.isShowRightTopMsg.msg : this.defaults.workTipMsg, 'right-top', bg);
            this.createTdLabel(td, this.defaults.workTipMsg);
        }

        //周末
        if (data.isWeekend) {
            this.createTdLabel(td, this.defaults.weekendTipMsg);
        }

        //还原任务
        if (data.task.length) {
            var task = this.dom.create('ul');
            task.className = 'task';
            for (var i = 0; i < data.task.length; i++) {
                var taskItem = this.dom.create('li');
                taskItem.innerText = data.task[i];
                taskItem.style.cssText = 'background:' + (['#f3faf0', '#ffeee6', '#eaf8fe', '#fff7e6'][~~(Math.random() * 4)]);
                task.appendChild(taskItem);
            }
            td.appendChild(task);
        }
    };
    /**
     * 是否为节假日
     * @param date
     */
    proty.isHoliday = function (date) {
        var holidayInfo = this.defaults.holiday[date.getMonth() + 1 + '.' + date.getDate()];
        return {
            isHoliday: !!holidayInfo,
            text: holidayInfo ? holidayInfo : ''
        };
    };

    /**
     * 创建Label
     */
    proty.createTdLabel = function (parent, txt, className, bg) {
        //<label class="right-bottom">节假日</label>
        var oL = this.dom.create('label');
        oL.innerText = txt;
        oL.className = className || 'right-bottom';
        oL.style.cssText = 'background:' + bg;
        parent.appendChild(oL);
    };

    /**
     * 获取对应日期的所保存的任务
     * @param date
     * @returns {{isHoliday: boolean, text: string}}
     */
    proty.getTask = function (date) {
        return this.task[Tools.formatDate(date.getTime(), 6)] || [];
    };

    /**
     * 添加任务
     * @param el
     * @param str
     */
    proty.createTask = function (el, str) {
        var taskText = str || prompt("Hey, buddy! 你想记个啥?");
        if (!taskText) {
            return;
        }

        //当期那日期存已创建任务,无需再次创建,添加即可
        if (!this.task[this.dom.getAttr(el, 'ymd')]) {
            this.task[this.dom.getAttr(el, 'ymd')] = [];
        }
        (this.task[this.dom.getAttr(el, 'ymd')]).push(taskText);

        var task = el.getElementsByTagName('ul')[0] || this.dom.create('ul');
        task.className = 'task';

        var taskItem = this.dom.create('li');
        taskItem.innerText = taskText;
        taskItem.style.cssText = 'background:' + (['#f3faf0', '#ffeee6', '#eaf8fe', '#fff7e6'][~~(Math.random() * 4)]);

        task.appendChild(taskItem);
        el.appendChild(task);
    };


    /**
     * dom 操作
     * @returns {Element}
     */
    proty.dom = {
        create: function (ele) {
            return document.createElement(ele);
        },
        byId: function (id) {
            return document.getElementById(id);
        },
        getAttr: function (el, attr) {
            return el.getAttribute(attr);
        },
        setAttr: function (el, attr, val) {
            return el.setAttribute(attr, val);
        },
        removeAllChild:function (ele) {
            while (ele.hasChildNodes()){
                ele.removeChild(ele.lastChild);
            }
        }
    };


    return Calendar;
});







//Array.map IE Polyfill
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var T, A, k;
        var O = Object(this);
        var len = O.length;
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}

//Date.format
Date.prototype.format = function (c) {
    c = c || "";
    if (isNaN(this)) {
        return "";
    }
    var b = {
        "m+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "n+": this.getMinutes(),
        "s+": this.getSeconds(),
        S: this.getMilliseconds(),
        W: ["日", "一", "二", "三", "四", "五", "六"][this.getDay()], "q+": Math.floor((this.getMonth() + 3) / 3)
    };
    if (c.indexOf("am/pm") >= 0) {
        c = c.replace("am/pm", (b["h+"] >= 12) ? "下午" : "上午");
        if (b["h+"] >= 12) {
            b["h+"] -= 12;
        }
    }
    if (/(y+)/.test(c)) {
        c = c.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var a in b) {
        if (new RegExp("(" + a + ")").test(c)) {
            c = c.replace(RegExp.$1, RegExp.$1.length == 1 ? b[a] : ("00" + b[a]).substr(("" + b[a]).length));
        }
    }
    return c;
};


/**
 * 简单工具类
 */
var Tools = {
    hasProperty: Object.prototype.hasOwnProperty,

    /**
     * Copy
     */
    extend: Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (this.hasProperty.call(target, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },
    /**
     * 添加事件
     * @param obj
     * @param type
     * @param fn
     * @param isCap
     */
    addEve: function (obj, type, fn, isCap) {
        if (obj.addEventListener) {//W3C
            obj.addEventListener(type, fn, isCap || false);
        } else if (obj.attachEvent) {//IE
            obj.attachEvent('on' + type, fn);
        }
    },
    /**
     * 移除事件
     * @param obj
     * @param type
     * @param fn
     */
    removeEve: function (obj, type, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type, fn, false);
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + type, fn);
        }
    },
    /**
     * 创建数组
     * @param length
     * @returns {Array}
     */
    createArr: function (length) {
        var range = new Array(length);
        for (var idx = 0; idx < length; idx++) {
            range[idx] = idx;
        }
        return range;
    },
    /**
     * 判断某个对象是否有指定的className
     * @param ele
     * @param cls
     */
    hasClass: function (ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    /**
     * 给指定对象添加className
     * @param ele
     * @param cls
     */
    addClass: function (ele, cls) {
        if (!hasClass(ele, cls)) ele.className += " " + cls;
    },

    /**
     * 删除className
     * @param ele
     * @param cls
     */
    removeClass: function (ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    },
    /**
     * 增减天数 返回日期
     * @param date
     * @param dayNums
     * @returns {*|{}|{year, month, date}}
     */
    addDayNum: function (date, dayNums) {
        return new Date(date.getTime() + (1000 * 60 * 60 * 24 * dayNums));
    },

    /**
     * 格式化时间
     * @param time
     * @param type
     * @returns {*}
     */
    formatDate: function (time, type) {
        var pattern = "yyyy-mm-dd hh:nn";
        switch (type) {
            case 1:
                pattern = "yyyy年mm月dd日";
                break;
            case 2:
                pattern = "hh:nn";
                break;
            case 3:
                pattern = "yyyy.mm.d";
                break;
            case 4:
                pattern = "yyyy-mm-dd hh:nn:ss";
                break;
            case 5:
                pattern = "yyyy年mm月";
                break;
            case 6:
                pattern = "yyyy-mm-dd";
                break;
            case 7:
                pattern = "yyyy年mm月dd日 hh:nn";
                break;
            case 8:
                pattern = "mm月dd日";
                break;
            case 9:
                pattern = "mm月dd日 hh:nn";
                break;
            case 10:
                pattern = "mm-dd";
                break;
            case 0:
                pattern = "yyyy/mm/dd";
                break;
            default:
                pattern = !!type ? type : pattern;
                break;
        }
        if (isNaN(time) || time === null) {
            return '';
        }

        if (typeof (time) == 'object') {
            var y = dd.getFullYear(), m = dd.getMonth(), d = dd.getDate();
            if (m < 10) m = '0' + m;
            return new Date(Date.UTC(y, m, d)).format(pattern);
        } else {
            return new Date(parseInt(time)).format(pattern);
        }
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js?sourceMap!./style.scss", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js?sourceMap!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "*{box-sizing:border-box}blockquote,body,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,li,ol,p,pre,td,textarea,th,ul{padding:0;margin:0}fieldset,img{border:0}address,caption,cite,code,dfn,em,strong,th,var{font-weight:400;font-style:normal}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-weight:400;font-size:100%}q:after,q:before{content:\"\"}abbr,acronym{border:0}.calendar{width:900px;margin:30px auto;overflow:hidden}.calendar .header{border-bottom:1px solid #c7c7c7;padding:10px 0;width:100%;text-align:center;margin-bottom:10px;overflow:hidden}.calendar .header li{float:left;width:14.2%}.calendar table.main{width:100%}.calendar table.main td{border:1px solid #c7c7c7;padding:20px 10px;position:relative;width:128.57143px;box-shadow:0 0 4px rgba(6,6,6,.25);border-radius:5px;overflow:hidden}.calendar table.main td.day .date{font-size:12px;text-decoration:underline}.calendar table.main td.week{background:#59d059}.calendar table.main td.holiday label,.calendar table.main td.week label{color:red}.calendar table.main td.disabled{color:#c7c7c7;opacity:.3;filter:alpha(opacity=80)}.calendar table.main td.active{background:red}.calendar table.main td .task li{margin:10px 5px;font-size:12px;position:relative;background:pink}.calendar table.main td .task li input{position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%}.calendar table.main td label{font-size:12px;position:absolute;padding:3px;border:1px solid #c7c7c7;border-right:none;color:#615d5d}.calendar table.main td label.right-top{right:0;top:0;border-top:none;border-bottom-left-radius:3px;background:#87d068}.calendar table.main td label.right-top.ill{background:orange}.calendar table.main td label.right-bottom{right:0;bottom:0;border-bottom:none;border-top-left-radius:3px}.calendar .selectArea{overflow:hidden}.calendar .selectArea select.year-list{float:left;margin:10px;margin-left:0}.calendar .selectArea ul.month-list{overflow:hidden;display:inline-block;margin:10px}.calendar .selectArea ul.month-list li{float:left;width:40px;height:40px;line-height:40px;border:1px solid #c7c7c7;border-left:none;text-align:center;cursor:pointer;font-size:12px}.calendar .selectArea ul.month-list li:first-child{border-left:1px solid #c7c7c7}.calendar .selectArea ul.month-list li.active{background:#ff7672}", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);