//会不会有页面没有调用init
mui.init({
    swipeBack: true
});
//
var ApiUrl = "http://test.hisunflower.com/mobile";
var WapSiteUrl = 'http://127.0.0.1:8020/wap_xrk';
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return '';
} 

function openW(url, name, param) {
	if(name){
		location.href = WapSiteUrl + url + '?'+name+'=' + param;
	}else{
		location.href = WapSiteUrl + url;
	}
    
}
function parseParam(param, key) {
    var paramStr = "";
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + encodeURIComponent(param);
    } else {
        $.each(param,
            function(i) {
                var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
                paramStr += '&' + parseParam(this, k);
            });
    }
    return paramStr.substr(1);
}

function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

function addCookie(name, value, expireHours) {
    var cookieString = name + "=" + escape(value) + "; path=/";
    //判断是否设置过期时间
    if (expireHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expireHours * 3600 * 1000);
        cookieString = cookieString + ";expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

function getCookie(name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) return unescape(arr[1]);
    }
    return null;
}

function delCookie(name) { //删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
}

function checkLogin(state) {
    if (state == 0) {
        var btnArray = ['下次再说', '去登录'];
        mui.confirm('您尚未登录APP', '向日葵来了', btnArray, function(e) {
            if (e.index == 1) {
                _.toLoginPage();
            }
        })
        return false;
    } else {
        return true;
    }
}

function contains(arr, str) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}

function buildUrl(type, data) {
    switch (type) {
        case 'keyword':
            return WapSiteUrl + '/tmpl/product_list.html?keyword=' + encodeURIComponent(data);
        case 'special':
            return WapSiteUrl + '/special.html?special_id=' + data;
        case 'goods':
            return WapSiteUrl + '/tmpl/product_detail.html?goods_id=' + data;
        case 'url':
            return data;
    }
    return WapSiteUrl;
}

function errorTipsShow(html) {
    $(".error-tips").html(html).show();
    setTimeout(function() {
        errorTipsHide();
    }, 3000);
}

function errorTipsHide() {
    $(".error-tips").html("").hide();
}

function writeClear(o) {
    if (o.val().length > 0) {
        o.parent().addClass('write');
    } else {
        o.parent().removeClass('write');
    }
    btnCheck(o.parents('form'));
}

function btnCheck(form) {
    var btn = true;
    form.find('input').each(function() {
        if ($(this).hasClass('no-follow')) {
            return;
        }
        if ($(this).val().length == 0) {
            btn = false;
        }
    });
    if (btn) {
        form.find('.btn').parent().addClass('ok');
    } else {
        form.find('.btn').parent().removeClass('ok');
    }
}
/**
 * 动态加载css文件
 * @param css_filename css文件路径
 */
function loadCss(css_filename) {
    var link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', css_filename);
    link.setAttribute('href', css_filename);
    link.setAttribute('rel', 'stylesheet');
    css_id = document.getElementById('auto_css_id');
    if (css_id) {
        document.getElementsByTagName('head')[0].removeChild(css_id);
    }
    document.getElementsByTagName('head')[0].appendChild(link);
}
/**
 * 动态加载js文件
 * @param script_filename js文件路径
 */
function loadJs(script_filename) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', script_filename);
    script.setAttribute('id', 'auto_script_id');
    script_id = document.getElementById('auto_script_id');
    if (script_id) {
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}
//判断对象是否为空
function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}
/* 格式化金额 */
function price_format(price){
    if(typeof(PRICE_FORMAT) == 'undefined'){
        PRICE_FORMAT = '&yen;%s';
    }
    price = number_format(price, 2);

    return PRICE_FORMAT.replace('%s', price);
}
/* 格式化数字 */
function number_format(num, ext){
    if(ext < 0){
        return num;
    }
    num = Number(num);
    if(isNaN(num)){
        num = 0;
    }
    var _str = num.toString();
    var _arr = _str.split('.');
    var _int = _arr[0];
    var _flt = _arr[1];
    if(_str.indexOf('.') == -1){
        /* 找不到小数点，则添加 */
        if(ext == 0){
            return _str;
        }
        var _tmp = '';
        for(var i = 0; i < ext; i++){
            _tmp += '0';
        }
        _str = _str + '.' + _tmp;
    }else{
        if(_flt.length == ext){
            return _str;
        }
        /* 找得到小数点，则截取 */
        if(_flt.length > ext){
            _str = _str.substr(0, _str.length - (_flt.length - ext));
            if(ext == 0){
                _str = _int;
            }
        }else{
            for(var i = 0; i < ext - _flt.length; i++){
                _str += '0';
            }
        }
    }

    return _str;
}
/**
 * =====================================
 *               日期相关方法
 * =====================================
 */
;
(function($) {
    $.extend({
        /**
         * 将日期格式化成指定格式的字符串
         * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
         * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
         * @returns 返回格式化后的日期字符串
         * //例子
         * formatDate(); // 2016-09-02 13:17:13
         * formatDate(new Date(), 'yyyy-MM-dd'); // 2016-09-02
         * 2016-09-02 第3季度 星期五 13:19:15:792
         * formatDate(new Date(), 'yyyy-MM-dd 第q季度 www HH:mm:ss:SSS');
         * formatDate(1472793615764); // 2016-09-02 13:20:15
         */
        formatDate: function(date, fmt) {
            date = date == undefined ? new Date() : date;
            date = typeof date == 'number' ? new Date(date) : date;
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
            var obj = {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            };
            var week = ['天', '一', '二', '三', '四', '五', '六'];
            for (var i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
                    var val = obj[i] + '';
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                    return m.length == 1 ? val : val.substring(val.length - m.length);
                });
            }
            return fmt;
        },

        /**
         * 将字符串解析成日期
         * @param str 输入的日期字符串，如'2014-09-13'
         * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
         * @returns 解析后的Date类型日期
         * 例子
         * parseDate('2016-08-11'); // Thu Aug 11 2016 00:00:00 GMT+0800
         * parseDate('2016-08-11 13:28:43', 'yyyy-MM-dd HH:mm:ss') // Thu Aug 11 2016 13:28:43 GMT+0800
         */
        parseDate: function(str, fmt) {
            fmt = fmt || 'yyyy-MM-dd';
            var obj = { y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0 };
            fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function(m, $1, $2, $3, $4, idx, old) {
                str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function(_m, _$1) {
                    obj[$3] = parseInt(_$1);
                    return '';
                });
                return '';
            });
            obj.M--; // 月份是从0开始的，所以要减去1
            var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
            if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
            return date;
        },
        /**
         * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
         * 当天的返回时分，当年的返回月日，否则，返回年月日
         * @param {Object} date
         */
        formatDateToFriendly: function(date) {
            date = date || new Date();
            date = typeof date === 'number' ? new Date(date) : date;
            var now = new Date();
            if ((now.getTime() - date.getTime()) < 60 * 1000) return '刚刚'; // 1分钟以内视作“刚刚”
            var temp = this.formatDate(date, 'yyyy年M月d');
            if (temp == this.formatDate(now, 'yyyy年M月d')) return this.formatDate(date, 'HH:mm');
            if (date.getFullYear() == now.getFullYear()) return this.formatDate(date, 'M月d日');
            return temp;
        },
        /**
         * 将一段时长转换成友好格式，如：
         * 147->“2分27秒”
         * 1581->“26分21秒”
         * 15818->“4小时24分”
         * @param {Object} second
         */
        formatDurationToFriendly: function(second) {
            if (second < 60) return second + '秒';
            else if (second < 60 * 60) return (second - second % 60) / 60 + '分' + second % 60 + '秒';
            else if (second < 60 * 60 * 24) return (second - second % 3600) / 60 / 60 + '小时' + Math.round(second % 3600 / 60) + '分';
            return (second / 60 / 60 / 24).toFixed(1) + '天';
        },
        /** 
         * 将时间转换成MM:SS形式 
         */
        formatTimeToFriendly: function(second) {
            var m = Math.floor(second / 60);
            m = m < 10 ? ('0' + m) : m;
            var s = second % 60;
            s = s < 10 ? ('0' + s) : s;
            return m + ':' + s;
        },
        /**
         * 判断某一年是否是闰年
         * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
         */
        isLeapYear: function(year) {
            if (year === undefined) year = new Date();
            if (year instanceof Date) year = year.getFullYear();
            return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        },
        /**
         * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
         * 方式一：$.getMonthDays();
         * 方式二：$.getMonthDays(new Date());
         * 方式三：$.getMonthDays(2013, 12);
         */
        getMonthDays: function(date, month) {
            var y, m;
            if (date == undefined) date = new Date();
            if (date instanceof Date) {
                y = date.getFullYear();
                m = date.getMonth();
            } else if (typeof date == 'number') {
                y = date;
                m = month - 1;
            }
            var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 非闰年的一年中每个月份的天数
            //如果是闰年并且是2月
            if (m == 1 && this.isLeapYear(y)) return days[m] + 1;
            return days[m];
        },
        /**
         * 计算2日期之间的天数，用的是比较毫秒数的方法
         * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
         * @param date1 日期一
         * @param date2 日期二
         */
        countDays: function(date1, date2) {
            var fmt = 'yyyy-MM-dd';
            // 将日期转换成字符串，转换的目的是去除“时、分、秒”
            if (date1 instanceof Date && date2 instanceof Date) {
                date1 = this.format(fmt, date1);
                date2 = this.format(fmt, date2);
            }
            if (typeof date1 === 'string' && typeof date2 === 'string') {
                date1 = this.parse(date1, fmt);
                date2 = this.parse(date2, fmt);
                return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
            } else {
                console.error('参数格式无效！');
                return 0;
            }
        }
    });
})(jQuery);

//=========================================从以下开始为新功能的公用函数==================================================
//封装常规操作
var _ = {
        //  跳转
        jump: function(url, name) {
            window.location.href = url;
        },
        //  取参
        param: function(param) {
            return getQueryString(param);
        }
    }
    //本地存储操作,扩展到_命名空间
_.ST = {
        get: function(ele) {
            window.localStorage.getItem(ele);
        },
        set: function(ele, val) {
            window.localStorage.setItem(ele, val);
        },
        cls: function() {
            window.localStorage.clear();
        },
        rm: function(ele) {
            window.localStorage.removeItem(ele);
        }
    }
    //页面id命名规范
_.pageName = {
        //首页id 默认为appid，调试环境为HBuilder
        bbs: 'bbs', //论坛
        message_center: 'message_center', //消息中心
        message_list: 'message_list', //消息列表
        message_chat: 'message_chat', //聊天对话框
        message_chat_list: 'message_chat_list',
        message_list_buyers: 'message_list_buyers',
        message_list_seller: 'message_list_seller',
        message_chat_system: 'message_chat_system', //客服聊天对话框
        //消息其他页待补充
        login: 'login', //登录
        register: 'register', //注册
        news_list: 'news_list', //文章列表
        news_detail: 'news_detail', //文章详情
        service_search_list: 'service_search_list', //服务搜索列表页
        service_class_list: 'service_class_list', //服务分类列表页
        service_list: 'service_list', //服务列表页
        service_detail: 'service_detail', //服务详情页
        service_book: 'service_book', //预约表单
        service_buy: 'service_buy', //订单确认页
        service_order_success: 'service_order_success', //订单成功页面(关闭从列表页开始的页面)
        service_order_fail: 'service_order_fail', //订单失败页面
        publish_needs_step1: 'publish_needs_step1', //发布需求第一步
        publish_needs_step2: 'publish_needs_step2', //需求表单
        publish_needs_step3: 'publish_needs_step3', //需求订单确认页面
        member: 'member', //会员中心页面
        address_select: 'address_select', //地址选择
        address_select_map: 'address_select_map', //地址选择地图
        address_list: 'address_list', //地址列表
        address_add: 'address_add', //地址添加
        address_edit: 'address_edit', //地址修改
        service_order_detail: 'service_order_detail', //公用订单详情页
        member_order_list: 'member_order_list', //买家订单列表页
        member_order_detail: 'member_order_detail', //买家订单详情页
        //会员中心其他......
        seller: 'seller', //卖家中心页面
        sell_order_list: 'sell_order_list', //买家订单列表页
        sell_order_detail: 'sell_order_detail', //买家订单详情页
        //卖家中心其他......
    }
    //打开窗口通用方法
_.openWindow = function(params) {
        console.log(JSON.stringify(params));
        if (!params) { return false; }
        var url = params.url,
            id = params.id,
            param = params.param || {},
            reOpen = (params.reOpen == undefined) ? true : params.reOpen,
            autoShow = (params.autoShow == undefined) ? true : params.autoShow,
            closeWindows = params.closeWindows || [],
            closeOthers = params.closeOthers || false;
        //关闭窗口子函数
        function _closeWindow(wid) {
            console.log('enter close window');
            if (closeOthers) {
                console.log('enter close ALl window');
                var wv = plus.webview.all();
                var appid = plus.runtime.appid;
                console.log('enter close id:' + wid);
                for (var i = 0; i < wv.length; i++) {
                    if (wv[i].id != appid && wv[i].id != wid) {
                        wv[i].close();
                    }
                }
            } else {
                if (closeWindows && closeWindows.length > 0) {
                    for (var i = 0; i < closeWindows.length; i++) {
                        plus.webview.close(closeWindows[i]);
                    }
                }
            }
        }
        autoShow || plus.nativeUI.showWaiting();
        //关闭存在的问题。
        var oldwin = plus.webview.getWebviewById(id);
        var createNew = false;
        if (oldwin && reOpen) {
            createNew = true;
            console.log('关闭窗口重新打开');
            oldwin.close();
        }
        var openw = mui.openWindow({
            url: url,
            id: id,
            extras: param,
            createNew: createNew,
            show: {
                autoShow: autoShow
            },
            waiting: {
                autoShow: autoShow
            }
        })
        autoShow || openw.addEventListener('loaded', function() {
            //页面加载完成后才显示
            plus.nativeUI.closeWaiting();
            openw.show();
        }, false);
        if (closeOthers || (closeWindows && closeWindows.length > 0)) {
            openw.addEventListener('show', function() {
                console.log('进入关闭窗口');
                console.log(id);
                _closeWindow(id);
            }, false);
        }

    }
    //全局消息数量
var global_message_count = 1;
_.openMessageTipsView = function(i) {
    mui.plusReady(function() {
        var view = plus.nativeObj.View.getViewById('messageTipsView');

        var system_view = plus.webview.getWebviewById('system_chat');
        var chat_view = plus.webview.getWebviewById('message_chat');

        if (!view) {
            view = new plus.nativeObj.View('messageTipsView', { bottom: '100px', left: '80%', height: '50px', width: '50px' }, [{ tag: 'img', id: 'messageTipsImg', src: '/images/mapmark.png', position: { top: '0px', left: '0px', width: '45px', height: '45px' } }]);
            view.drawRect({ color: '#f90', radius: '10px' }, { top: '0px', left: '32px', width: '18px', height: '18px' });
            view.drawText(i, { top: '0px', left: '32px', width: '18px', height: '18px' }, { color: '#000', size: '12px', align: 'center' }, 'messageTipsText');
            view.setTouchEventRect({ top: '0px', left: '0px', width: '100%', height: '100%' });
            view.interceptTouchEvent(true);
            view.addEventListener("click", function() {
                //console.log('click /tmpl/message/message_list.html');
                var key = _.userInfo.getKey();
                if (!key) {
                    checkLogin(0);
                    return;
                }
                _.openWindow({
                    url: '/tmpl/message/message_list.html',
                    id: _.pageName.message_center,
                    reOpen: true
                });
                global_message_count = 1;
                view.close();
            }, false);
        } else {
            view.drawText(i, { top: '0px', left: '32px', width: '18px', height: '18px' }, { color: '#000', size: '12px', align: 'center' }, 'messageTipsText');
        }

        if (system_view) {
            _.playQq();
        } else if (chat_view) {
            _.playQq();
        } else {
            _.playMessage()
        }

        view.show();
    })
}

_.closeMessageTipsView = function(i) {
    mui.plusReady(function() {
        var view = plus.nativeObj.View.getViewById('messageTipsView');
        view.hide();
    })
}
_.playSound = function(url) {
        p = plus.audio.createPlayer(url);
        //alert(url);
        p.play(function() {
            //alert('播放ok');
            _.debug('播放声音ok');
        }, function(e) {
            //alert('播放音频文件"'+url+'"失败：'+e.message);
            _.debug('播放音频文件"' + url + '"失败：' + e.message);
        })
    }
    //采用_www表示根目录来定位文件
_.playMessage = function() {
    var url = '_www/sound/message.mp3';
    _.playSound(url);
}
_.playQq = function() {
        var url = '_www/sound/qq.wav';
        _.playSound(url);
    }
    //用户信息操作,扩展到_命名空间
_.userInfo = {
        set: function(res) {
            var $userinfo = {};
            $userinfo.key = res.key;
            //member_id放入缓存中，避免每次发送消息要重取
            $userinfo.member_id = res.member_id;
            $userinfo.username = res.member_name;
            $userinfo.photo = res.member_avatar;
            $userinfo.phone = res.member_mobile;
            $userinfo.sex = res.member_sex;
            $userinfo.price = res.available_predeposit;
            $userinfo.point = res.member_points;
            //应该加入缓存时间
            $userinfo._ticktime = new Date().getTime();
            window.localStorage.setItem('userinfo', JSON.stringify($userinfo));
        },
        updateName: function(name) {
            var $userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
            $userinfo.username = name;
            window.localStorage.setItem('userinfo', JSON.stringify($userinfo));
        },
        updateStoreName: function(name) {
            var $userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
            $userinfo.storename = name;
            window.localStorage.setItem('userinfo', JSON.stringify($userinfo));
        },
        get: function() {
            var $userinfo = null;
			try{
				$userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
			}catch(e){}
            //校验缓存时间，超过时间应该清空缓存，重新登录
            if ($userinfo) {
                var ticktime = $userinfo._ticktime;
                if (!ticktime) { return null; }
                var curtime = new Date().getTime();
                //30天缓存
                if ((curtime - ticktime) > 30 * 24 * 60 * 60 * 1000) {
                    //超时清空
                    _.ST.cls();
                    return null;
                } else {
                    return $userinfo;
                }
            } else {
                return null;
            }
        },
        clear: function() {
            window.localStorage.removeItem('userinfo');
        },
        getKey: function() {
            var key = "";
            if (getQueryString('key') != '') {
                key = getQueryString('key');
            } else {
                var $userinfo = this.get();
                if (!isEmpty($userinfo)) {
                    key = $userinfo.key;
                }
            }
            return (key == "" || key == undefined || key == null) ? "" : key;
        }
    }
    //用户店铺信息操作,扩展到_命名空间
_.storeInfo = {
        set: function(res) {
            var $storeinfo = {};
            $storeinfo.storeId = res.store_info.store_id;
            $storeinfo.storeName = res.store_info.store_name;
            $storeinfo.photo = res.store_info.store_avatar;
            $storeinfo.sellerId = res.store_info.seller_id;
            $storeinfo.sellerName = res.store_info.seller_name;
            $storeinfo.storeState = res.store_info.store_state;
            $storeinfo.storeSredit_average = res.store_info.store_credit_average;
            $storeinfo.storeSredit_percent = res.store_info.store_credit_percent;
            $storeinfo.store_evaluate = res.store_info.store_evaluate;
            $storeinfo.storeSales = res.store_info.store_sales;
            $storeinfo.isAdmin = res.store_info.is_admin;
            $storeinfo.is_person = res.store_info.is_person;

            window.localStorage.setItem('storeinfo', JSON.stringify($storeinfo));
        },
        get: function() {
        	var $storeinfo = null;
			try{
				$storeinfo = JSON.parse(window.localStorage.getItem('storeinfo'));
			}catch(e){}
            return $storeinfo;
        },
        clear: function() {
            window.localStorage.removeItem('storeinfo');
        }
    }
    //到首页
_.toHomePage = function() {
	openW('/index.html');
//  mui.plusReady(function() {
//      plus.webview.getLaunchWebview().show();
//  })
}
_.getCityInfo = function() {
	var $cityinfo = null;
	try{
		$cityinfo = JSON.parse(window.localStorage.getItem('cityinfo'));
	}catch(e){}
    if ($cityinfo && $cityinfo.area_name && parseInt($cityinfo.area_id) > 0) {
        return $cityinfo;
    } else {
        return null;
    }
}
_.getDefaultCityInfo = function() {
    return { area_id: 224, area_name: '青岛市' };
}
_.setCityInfo = function(area_id, area_name) {
        if (area_id && area_name) {
            var $cityinfo = new Object();
            $cityinfo.area_id = area_id;
            $cityinfo.area_name = area_name;
            window.localStorage.setItem('cityinfo', JSON.stringify($cityinfo));
            return true;
        } else {
            return false;
        }
    }
    //关闭所有页面到首页
_.toHomePageAndCloseAll = function() {
    mui.plusReady(function() {
        var appid = plus.runtime.appid;
        var wv = plus.webview.all();
        for (var i = 0; i < wv.length; i++) {
            if (wv[i].id != appid) {
                wv[i].close();
            }
        }
    })
}

//到登录页面
_.toLoginPage = function() {
        var loginUrl = WapSiteUrl + '/tmpl/member/login.html';
        if (window.plus) {
            mui.plusReady(function() {
                mui.openWindow({
                    url: loginUrl,
                    id: _.pageName.login,
                    show: {
                        aniShow: 'zoom-fade-out'
                    },
                    waiting: {
                        autoShow: false,
                        title: '正在加载...'
                    }
                })
            })
        } else {
            window.location.href = loginUrl;
        }
    }
    //拨打电话
_.dial = function(telphone) {
    var btnArray = ['取消', '确定'];
    var title = "向日葵来了";
    var msg = "您确定要拨打电话吗？";
    if (window.plus) {
        mui.plusReady(function() {
            plus.nativeUI.confirm(msg,
                function(e) {
                    if (e.index == 1) {
                        plus.device.dial(telphone, false);
                    } else {
                        return false;
                    }
                }, title, btnArray
            )
        })
    } else {
        mui.confirm(msg, title, btnArray, function(e) {
            if (e.index == 1) {
                window.open("tel:" + telphone);
            }
        })
    }
}
_.debug = function(info) {
        if (global_debug) {
            if (typeof info == "object") {
                console.log(JSON.stringify(info));
            } else {
                console.log(info)
            }
        }
    }
    //ajax方法，扩展到_命名空间
_.data = {
    // ajax方法
    // url 		: 	url
    // type 	: 	post || get || put
    // loading 	: 	true || false
    // data 	: 	data || 空
    // callback : 	success function
    // _.data.send(url,'get',false,{data1,data2},function(data){});
    send: function(url, type, loading, data, callback, async) {

        if (async == undefined) {
            async = true;
        }

        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            data: data,
            async: async,
            beforeSend: function() {
                if (loading) {
                    $("#loading").fadeIn();
                }
            },
            success: callback,
            error: function(err) {
                console.log(JSON.stringify(err));
            },
            complete: function() {
                if (loading) {
                    $("#loading").fadeOut();
                }
            }
        })
    },

    // 初始化
    // 目前打算在这里操作清空
    init: function() {

    },

    // 数据填充
    // ele 		: 	元素
    // data 	: 	数据
    create: function(ele, data) {
        template(ele, data)
    },

    // 没有数据
    nodata: function() {

    }

}

//===================================以下为功能类函数=============================================================
/**
 * 取得默认系统搜索关键词
 * @param cmd
 */
function getSearchName() {
    var keyword = decodeURIComponent(getQueryString('keyword'));
    if (keyword == '') {
        if (getCookie('deft_key_value') == null) {
            $.getJSON(ApiUrl + '/index.php?act=index&op=search_hot_info', function(result) {
                var data = result.datas.hot_info;
                if (typeof data.name != 'undefined') {
                    $('#keyword').attr('placeholder', data.name);
                    $('#keyword').html(data.name);
                    addCookie('deft_key_name', data.name, 1);
                    addCookie('deft_key_value', data.value, 1);
                } else {
                    addCookie('deft_key_name', '', 1);
                    addCookie('deft_key_value', '', 1);
                }
            })
        } else {
            $('#keyword').attr('placeholder', getCookie('deft_key_name'));
            $('#keyword').html(getCookie('deft_key_name'));
        }
    }
}
// 免费领代金券
function getFreeVoucher(tid) {
    var key = _.userInfo.getKey();
    if (!key) {
        checkLogin(0);
        return;
    }
    $.ajax({
        type: 'post',
        url: ApiUrl + "/index.php?act=member_voucher&op=voucher_freeex",
        data: {
            tid: tid,
            key: key
        },
        dataType: 'json',
        success: function(result) {
            checkLogin(result.login);
            var msg = '领取成功';
            //var skin = 'green';
            if (result.datas.error) {
                msg = '领取失败：' + result.datas.error;
                //skin = 'red';
            }
            mui.toast(msg);
        }
    });
}

// 登陆后更新购物车
function updateCookieCart(key) {
    var cartlist = decodeURIComponent(getCookie('goods_cart'));
    if (cartlist) {
        $.ajax({
            type: 'post',
            url: ApiUrl + '/index.php?act=member_cart&op=cart_batchadd',
            data: {
                key: key,
                cartlist: cartlist
            },
            dataType: 'json',
            async: false
        });
        delCookie('goods_cart');
    }
}
/**
 * 查询购物车中商品数量
 * @param key
 * @param expireHours
 */
function getCartCount(key, expireHours) {
    var cart_count = 0;
    if (_.userInfo.getKey() !== null && getCookie('cart_count') === null) {
        var key = _.userInfo.getKey();
        $.ajax({
            type: 'post',
            url: ApiUrl + '/index.php?act=member_cart&op=cart_count',
            data: {
                key: key
            },
            dataType: 'json',
            async: false,
            success: function(result) {
                if (typeof(result.datas.cart_count) != 'undefined') {
                    addCookie('cart_count', result.datas.cart_count, expireHours);
                    cart_count = result.datas.cart_count;
                }
            }
        });
    } else {
        cart_count = getCookie('cart_count');
    }
    if (cart_count > 0 && $('.nctouch-nav-menu').has('.cart').length > 0) {
        $('.nctouch-nav-menu').has('.cart').find('.cart').parents('li').find('sup').show();
        $('#header-nav').find('sup').show();
    }
}
/**
 * 查询是否有新消息
 */
function getChatCount() {
    if ($('#header').find('.message').length > 0) {
        var key = _.userInfo.getKey();
        if (key !== null) {
            $.getJSON(ApiUrl + '/index.php?act=member_chat&op=get_msg_count', {
                key: key
            }, function(result) {
                if (result.datas > 0) {
                    $('#header').find('.message').parent().find('sup').show();
                    $('#header-nav').find('sup').show();
                }
            });
        }
        $('#header').find('.message').parent().click(function() {
            window.location.href = WapSiteUrl + '/tmpl/member/chat_list.html';
        });
    }
}

/**
 * 异步上传图片
 */
$.fn.ajaxUploadImage = function(options) {
    var defaults = {
        url: '',
        data: {},
        start: function() {}, // 开始上传触发事件
        success: function() {}
    }
    var options = $.extend({}, defaults, options);
    var _uploadFile;

    function _checkFile() {
        //文件为空判断
        if (_uploadFile === null || _uploadFile === undefined) {
            mui.alert('请选择您要上传的文件！', '提示', '确定');
            return false;
        }
        //
        //          //检测文件类型
        //          if(_uploadFile.type.indexOf('image') === -1) {
        //				mui.alert('请选择图片文件！','提示','确定');
        //              return false;
        //          }
        //
        //          //计算文件大小
        //          var size = Math.floor(_uploadFile.size/1024);
        //          if (size > 5000) {
        //				mui.alert('上传文件不得超过5M!','提示','确定');
        //              return false;
        //          };
        return true;
    };
    return this.each(function() {
        $(this).on('change', function() {
            var _element = $(this);
            options.start.call('start', _element);
            _uploadFile = _element.prop('files')[0];
            console.log(JSON.stringify(_uploadFile));
            //怎么手机上的图片文件没有扩展名？
            if (!_checkFile) return false;
            //表单数据
            var formData = new FormData();
            for (k in options.data) {
                formData.append(k, options.data[k]);
            }
            formData.append(_element.attr('name'), _uploadFile);
            $.ajax({
                url: options.url,
                type: 'POST',
                data: formData,
                dataType: 'json',
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function(returndata) {
                    if (returndata.code == 200) {
                        options.success.call('success', _element, returndata);
                    } else {
                    	$(".loadingimg").hide();
                        console.log(JSON.stringify(returndata));
                        mui.alert(returndata.datas.error);
                    }
                },
                error: function(e) {
                    console.log(e);
                    mui.alert('服务器开小差了！');
                }
            });
            /*
             在本地执行不好用，只能在服务端执行
             	try {
            	//执行上传操作
            	var xhr = new XMLHttpRequest();
            	xhr.open("post", options.url, true);
            	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            	xhr.onreadystatechange = function() {
            		if(xhr.readyState == 4) {
            			returnDate = $.parseJSON(xhr.responseText);
            			options.success.call('success', _element, returnDate);
            		};
            	};
            	//表单数据
            	var fd = new FormData();
            	for(k in options.data) {
            		fd.append(k, options.data[k]);
            	}

            	fd.append(_element.attr('name'), _uploadFile);
            	//执行发送
            	console.log(fd);
            	result = xhr.send(fd);
            } catch(e) {
            	console.log(e);
            	alert(e);
            }*/
        });
    });
}

function loadSeccode() {
    $("#codekey").val('');
    //加载验证码
    $.ajax({
        type: 'get',
        url: ApiUrl + "/index.php?act=seccode&op=makecodekey",
        async: false,
        dataType: 'json',
        success: function(result) {
            $("#codekey").val(result.datas.codekey);
        }
    });
    $("#codeimage").attr('src', ApiUrl + '/index.php?act=seccode&op=makecode&k=' + $("#codekey").val() + '&t=' + Math.random());
}
/**
 * 收藏店铺
 */
function favoriteStore(store_id) {
    var key = _.userInfo.getKey();
    if (!key) {
        checkLogin(0);
        return;
    }
    if (store_id <= 0) {
        mui.toast('参数错误');
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?act=member_favorites_store&op=favorites_add',
        data: {
            key: key,
            store_id: store_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                mui.toast('收藏成功');
                return_val = true;
            } else {
                mui.toast(result.datas.error);
            }
        }
    });
    return return_val;
}
/**
 * 取消收藏店铺
 */
function dropFavoriteStore(store_id) {
    var key = _.userInfo.getKey();
    if (!key) {
        checkLogin(0);
        return;
    }
    if (store_id <= 0) {
        mui.toast('参数错误');
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?act=member_favorites_store&op=favorites_del',
        data: {
            key: key,
            store_id: store_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                return_val = true;
            } else {
                mui.toast(result.datas.error);
            }
        }
    });
    return return_val;
}
/**
 * 收藏商品
 */
function favoriteGoods(goods_id) {
    var key = _.userInfo.getKey();
    if (!key) {
        checkLogin(0);
        return;
    }
    if (goods_id <= 0) {
        mui.toast('参数错误');
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?act=member_favorites&op=favorites_add',
        data: {
            key: key,
            goods_id: goods_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                mui.toast('收藏成功');
                return_val = true;
            } else {
                mui.toast(result.datas.error);
            }
        }
    });
    return return_val;
}
/**
 * 取消收藏商品
 */
function dropFavoriteGoods(goods_id) {
    var key = _.userInfo.getKey();
    if (!key) {
        checkLogin(0);
        return;
    }
    if (goods_id <= 0) {
        mui.toast('参数错误');
        return false;
    }
    var return_val = false;
    $.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?act=member_favorites&op=favorites_del',
        data: {
            key: key,
            fav_id: goods_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.code == 200) {
                mui.toast('已取消收藏');
                return_val = true;
            } else {
                mui.toast(result.datas.error);
            }
        }
    });
    return return_val;
}

/**
 * 公共支付方法
 * @param data          获取支付信息数据
 * @param payment_code  支付方式 alipay_native  wxpay_native
 * @param channels       支付方式对象， {alipay:xx, wxpay:xx}
 * @param cb            支付回调函数
 */
function mobilePay(data, payment_code, channels, cb) {

    var server = '',
        channel = '',
        baseUrl = ApiUrl + '/index.php?act=member_payment&op=';

    if (payment_code == 'alipay_native') {
        server = baseUrl + 'alipay_native_service_pay';
        channel = channels.alipay;
    } else if(payment_code == 'wxpay_native') {
        server = baseUrl + 'wx_app_service_pay3';
        channel = channels.wxpay;
    } else {
        cb({ state: false, msg: '没有对应的支付方式' });
    }
//
//  console.log(server);
//  console.log(JSON.stringify(data));
//  console.log('==================');
    $.ajax({
        url: server,
        type: 'post',
        data: data,
        async: false,
        dataType: 'json',
        beforesend: function() {
            $("#loading").fadeIn();
        },
        success: function(data) {
//          console.log(JSON.stringify(data) + '-------1-------');
            if (data.code == 200) {
                var sign = '';
                if(channel.id == 'alipay'){
                	sign = data.datas.signStr;
                } else if(channel.id == 'wxpay'){
                	sign = JSON.stringify(data.datas);
                } else {
                	cb({ state: false, msg: '不支持的支付方式' });
                	return false;
                }
                hj.payment.request(channel, sign, function(result) {
                    cb({ state: true, msg: '支付成功' });

                }, function(error) {
                    cb({ state: false, msg: "支付失败：" + error.code });
                });

            } else {
                cb({ state: false, msg: data.datas.error });
            }
        },
        error:function(){
        	cb({ state: false, msg: '服务器开小差了' });
        },
        complete: function() {
            $("#loading").fadeOut();
        }
    });

    // return return_data;

}
// 监听网络 如果没有网络 跳至=>没有网络页面
/*mui.plusReady(function() {
	function wainshow() {
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			mui.alert("网络异常，请检查网络设置！");
			mui.openWindow({
				url: '/tmpl/neterror.html',
				id: 'neterror'
			})
		}
	}
	document.addEventListener("netchange", wainshow, false);
});
*/


/*mui.plusReady(function() {
	//窗口数测试
	var wv = plus.webview.all();
	var vCount = wv.length;
	console.log('窗口个数：' + vCount);
	for (var i = 0;i<vCount;i++) {
		console.log(wv[i].id);
	}
})*/
/**
 * @description 增加ajax全局事件，对未使用钢琴加载动画的ajax请求进行处理（需要在data中增加globalLoading为true）
 * @author zhaobing
 * @version 2017年7月24日10:13:193
 */
$(document).ajaxSend(function(event, request, settings) {
    var globalLoading = settings.type.toLowerCase() == 'post' ? (settings.data.globalLoading || false) : (settings['url'].indexOf('globalLoading=true') >= 0)
    if (globalLoading) {
        if ($("#loading").size() == 0) {
            //空格不可删除
            $('<div id="loading"> <div class="spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div></div>').appendTo($('body'));
        }
        $("#loading").fadeIn();
    }
});
$(document).ajaxComplete(function(event, request, settings) {
    var globalLoading = settings.type.toLowerCase() == 'post' ? (settings.data.globalLoading || false) : (settings['url'].indexOf('globalLoading=true') >= 0)
    if (globalLoading) {
        $("#loading").fadeOut();
    }
});

/**
 *@author:zhaoyangyue
 * @description: 手机号中间4位隐藏、
 * 				身份证隐藏后10位、
 * 				姓名只显示姓氏
 */
_.starMobile = function(mobile){
	return mobile.substring(0,3) + '****' + mobile.substring(8, mobile.length-1);
}
_.starUsername = function(name){
	var len = name.length;
	var firstName = '';
	var starLen = 0;
	if(len <= 3){
		firstName = name.substring(0,1);
	}else if(len == 4){
		firstName = name.substring(0,2);
		
	}
	starLen = name.length - firstName.length;
	return firstName + '*'.repeat(starLen);
}

_.starIdcard = function(idcard){
	var len = idcard.length - 10;
	return idcard.substr(0,len) + '*'.repeat(10);
}

/**
 *@author:zhaoyangyue
 * @desc: 发送短信验证码操作  需要手动添加class名称   
 * 		 手机号 input 添加属性 name=username    发送验证码按钮添加 id=yzm
 * 		type 2:登陆  目前添加店员和登陆验证码使用  
 *     //短信类型:1为注册,2为登录,3为找回密码,4为三方登录绑定手机
 */
_.getConfirmmsg = function(inputname,log_type){
	inputname = inputname || 'username';
	log_type = log_type || '2';
	// 验证码倒计时
    $('#yzm').on('tap', function() {  
        console.log('获取验证码');
        if ($('input[name="'+inputname+'"]').val().length != 11) {
            mui.alert('请输入正确的手机号码');
            return false;
        }

        var $sendmsg = ApiUrl + "/index.php?act=login&op=send_sms_msg";
        var $phone = $('input[name="'+inputname+'"]').val();
        var $this = $(this);
        var num = 60;
        var timer = null;
        console.log($phone);
        timer = setInterval(function() {
            num--;
            $this.prop('disabled', true).html(num + "秒后重发");
            if (num == 0) {
                clearInterval(timer);
                $this.prop('disabled', false).html("获取验证码");
                num = 60;
            }
        }, 1000);
        $.ajax({
            type: "post",
            url: $sendmsg,
            async: true,
            data: {
                phone: $phone,
                type: log_type   
            },
            success: function(res) {
                console.log("短信接口返回值" + res)
                var data = JSON.parse(res);
                if (data.code == 200) {
                    mui.toast('发送验证码成功');
                } else if (data.code == 400) {
                    mui.alert(data.datas.error);
                }
            },
            error: function(err) {
				mui.alert("网络异常，请稍后重试！");
            }
        });

    })
}

//定义全局消息清单
/**
 *@author:zhaoyangyue   
 * @description:   暂定
 * 				type： 消息类型 
 * 				order： 订单  
 * 				voucher： 代金券红包   
 * 				repluse： 退货
 * 				accounts：  账户金额变动
 * 				repluse： 服务商类目变动
 * @version: 2017-8-19
 */
_.member_msg_tpl = {
	arrival_notice:{tplname:'到货通知提醒', type: ''},
	change_no_pay_order:{tplname:'用户取消未支付订单提醒', type: 'order'},	
	change_payed_order:{tplname:'用户取消已支付订单提醒', type: 'order'},		
	consult_goods_reply:{tplname:'商品咨询回复提醒', type: ''},	
	consult_mall_reply:{tplname:'平台客服回复提醒', type: ''},	
	needs_qiang:{tplname:'服务商抢单提醒', type: 'order'},	
	needs_tou:{tplname:'服务商投标提醒', type: ''},	
	order_book_end_pay:{tplname:'预定订单尾款支付提醒', type: 'order'},	
	order_deliver_success:{tplname:'商品出库提醒', type: ''},	
	order_payment_success:{tplname:'付款成功提醒', type: 'order'},	
	order_spay_price:{tplname:'服务商修改订单金额提醒', type: 'order'},	
	predeposit_change:{tplname:'余额变动提醒', type: 'accounts'},	
	recharge_card_balance_change:{tplname:'充值卡余额变动提醒', type: 'vouchar'},	
	refund_return_notice:{tplname:'退款退货提醒', type: 'order'},	
	rpt_use:{tplname:'红包使用提醒', type: 'vouchar'},	
	service_additional:{tplname:'追加服务提醒', type: 'order'},	
	service_begin:{tplname:'开始服务提醒', type: 'order'},	
	service_change_price:{tplname:'订单金额变更提醒', type: 'order'},	
	service_confirm:{tplname:'服务商确认提醒', type: 'order'},	
	service_decline:{tplname:'服务商拒绝提醒', type: 'order'},	
	service_finished:{tplname:'服务商完成提醒', type: 'order'},	
	service_order_payment_success:{tplname:'服务订单付款成功提醒', type: 'order'},	
	service_refund_notice:{tplname:'服务退款提醒', type: 'order'},	
	store_refuse_order:{tplname:'商家拒绝接单订单提醒', type: 'order'},	
	voucher_use:{tplname:'代金券使用提醒', type: 'vouchar'},	
	voucher_will_expire:{tplname:'代金券即将到期提醒', type: 'vouchar'},	
	vr_code_will_expire:{tplname:'兑换码即将到期提醒', type: 'vouchar'}	
};
_.store_msg_tpl = {
	change_no_pay_order:{tplname:'用户取消未支付订单', type: 'order'},	
	child_order:{tplname:'尾款提醒', type: 'order'},	
	complain:{tplname:'商品被投诉提醒', type: ''},	
	goods_storage_alarm:{tplname:'商品库存预警', type: ''},	
	goods_verify:{tplname:'商品审核失败提醒', type: ''},	
	goods_violation:{tplname:'商品违规被下架', type: ''},	
	new_needs:{tplname:'用户发送需求提醒', type: ''},	
	new_order:{tplname:'新订单提醒', type: 'order'},	
	new_select:{tplname:'用户投标信息提醒', type: ''},	
	new_service:{tplname:'用户发送预约提醒', type: 'order'},	
	refund:{tplname:'退款提醒', type: 'order'},	
	refund_auto_process:{tplname:'退款自动处理提醒', type: 'order'},	
	return:{tplname:'退货提醒', type: 'repluse'},	
	return_auto_process:{tplname:'退货自动处理提醒', type: 'repluse'},	
	return_auto_receipt:{tplname:'退货未收货自动处理提醒', type: 'repluse'},	
	service_finished:{tplname:'用户确认完成提醒', type: 'order'},	
	service_refund_process:{tplname:'用户取消服务提醒', type: 'order'},	
	store_bill_affirm:{tplname:'结算单等待确认提醒', type: 'accounts'},	
	store_bill_gathering:{tplname:'结算单已经付款提醒', type: 'accounts'},	
	store_bind_class_applay_check:{tplname:'后台审核新类目给商家提醒', type: 'join'},	
	store_cost:{tplname:'店铺消费提醒', type: 'accounts'},	
	store_expire:{tplname:'店铺到期提醒', type: ''}
}