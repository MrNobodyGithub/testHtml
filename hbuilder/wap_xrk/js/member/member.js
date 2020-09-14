
 
var nationaldata = [
    "汉族", "壮族", "满族", "回族", "苗族", "维吾尔族", "土家族", "彝族", "蒙古族", "藏族", "布依族", "侗族", "瑶族", "朝鲜族", "白族", "哈尼族",
    "哈萨克族", "黎族", "傣族", "畲族", "傈僳族", "仡佬族", "东乡族", "高山族", "拉祜族", "水族", "佤族", "纳西族", "羌族", "土族", "仫佬族", "锡伯族",
    "柯尔克孜族", "达斡尔族", "景颇族", "毛南族", "撒拉族", "布朗族", "塔吉克族", "阿昌族", "普米族", "鄂温克族", "怒族", "京族", "基诺族", "德昂族", "保安族",
    "俄罗斯族", "裕固族", "乌孜别克族", "门巴族", "鄂伦春族", "独龙族", "塔塔尔族", "赫哲族", "珞巴族"
];
window.onload = function() {
    var nat = document.getElementById("national");
    for (var i = 0; i < nationaldata.length; i++) {
        var option = document.createElement('option');
        option.value = i;
        var txt = document.createTextNode(nationaldata[i]);
        option.appendChild(txt);
        nat.appendChild(option);
    }
}
var $key = _.userInfo.getKey();
/**
 * @author:zhaoyangyue
 * @data: 2017-8-1
 * @description:在加载前先去本地缓存填充图像和用户名
 */
var mInfo = _.userInfo.get();
console.log("======" + JSON.stringify(mInfo));

if (mInfo) {
    //用户名显示
    $('.ucenter-box').find('h2').text(mInfo.username);
    //用户头像
    $('.ucenter-box').find('img').attr('src', mInfo.photo);
}
/********************************************************************************/
//mui.init({
//  swipeBack: true,
//  pullRefresh: {
//      container: '#memberInfo',
//      down: {
//          style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
//          color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
//          height: '50px', //可选,默认50px.下拉刷新控件的高度,
//          range: '100px', //可选 默认100px,控件可下拉拖拽的范围
//          offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
//          auto: false, //可选,默认false.首次加载自动上拉刷新一次
//          callback: pullRefreshdown //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//      }
//  }
//})

function pullRefreshdown() {
//  console.log('会员中心刷新页面');
    loadPersoninfo();
}

//mui.plusReady(function() {
	// 动态改变webview的侧滑返回功能：
//	var wv = plus.webview.currentWebview(); 
	// 关闭侧滑返回功能
//	wv.setStyle({
//	    'popGesture': 'none'
//	});
//  plus.webview.close('register');
//  plus.webview.close('login');

    pullRefreshdown();

    window.addEventListener('loaddata', function(event) {
        pullRefreshdown();
    })

    //会员中心只能回退到首页
    mui.back = function() {
        plus.webview.close('register');
        plus.webview.close('login');
        plus.webview.getLaunchWebview().show();
    }
//})

//加载用户中心数据
function loadPersoninfo() {
    /**
     * @author: zhaoyangyue
     * @des: 获取会员数据直接从接口获取  调用函数跟新数据
     */

    var pullRefresh = mui('#memberInfo').pullRefresh();
    console.log($key);
    if (!$key) {
        $('body').removeClass('login');
        $('#loading').fadeOut();
        //结束上拉下拉刷新
        pullRefresh.endPulldown(true);
    } else {
        $('body').addClass('login');
        var $box = $('.ucenter-box'); //登陆状态 更改显示用户名

        //获取会员信息
        var
            $url = ApiUrl + '/index.php?act=member_account&op=getMemberInfo',
            $data = {
                key: $key
            };

        _.data.send($url, 'get', true, $data, function(data) {

            console.log("获取会员信息：" + JSON.stringify(data));

            $('#loading').fadeOut();
            if (data.code == 200) {
                var $state = data.datas.member_vstate, //实名认证
                    $ident = $('.ucenter-ident');

                if ($state == "10") {
                    $ident.text("未提交").on('tap', function() {
                        mui.openWindow({
                            url: "authentication.html",
                            //id: 'config',
                            waiting: {
                                autoShow: true,
                                title: '正在加载...'
                            }
                        });
                    })
                } else if ($state == "20") {
                    $ident.text("已认证")
                } else if ($state == "30") {
                    $ident.text("待审核")
                } else if ($state == "40") {
                    $ident.text("审核失败").on('tap', function() {
                    	openW('/tmpl/member/authentication.html');
                    });
                }

                //每次下拉重新存储本地缓存
                _.userInfo.clear();
                _.storeInfo.clear();
                data.datas.key = $key;
                _.userInfo.set(data.datas);
                _.storeInfo.set(data.datas);

                var $box = $('.ucenter-box'),
                    // $nav = $('.ucenter-nav'), //优惠券、红包导航栏
                    $con = $('.ucenter-config'),
                    $sex;

                console.log(data.datas.store_info);
                //判断是否是服务商  添加属性判断
                if (data.datas.store_info == '') {
                    $con.attr('data-type', '0'); //个人
                } else {
                    $con.attr('data-type', '1'); //服务商
                }
                //如果已是服务商  删除招募
                if (data.datas.store_info != '') {
                    $(".ucenter-type").find("a").eq(3).css("display", "none");
                }
                // $nav.find('a').eq(1).find('span').text(data.datas.member_points);  //优惠券导航
//              console.log(data.datas.member_sex);

                //用户名显示
                $box.find('h2').text(data.datas.member_name);
                //用户头像
                $box.find('img').attr('src', data.datas.member_avatar);

                // 个人资料显示
                // 用户头像
                $('.person-img').attr('src', data.datas.member_avatar);
                //用户等级
                $('.member_lv').html("LV" + data.datas.member_lv);
                // 用户名称
                $('.usernamemax').val(data.datas.member_name);
                //用户性别
                if (data.datas.member_sex == 0) {
                    $sex = '保密';
                    $('.secret').attr('selected', 'selected');
                } else if (data.datas.member_sex == 1) {
                    $sex = '男';
                    $('.male').attr('selected', 'selected');
                } else if (data.datas.member_sex == 2) {
                    $sex = '女';
                    $('.famale').attr('selected', 'selected');
                }
                //生日
                $('input[name="birth"]').val(data.datas.member_birthday);
                //民族
                $("#national option").each(function() {
                    if ($(this).text() == data.datas.member_nation) {
                        $(this).attr("selected", true);
                    }
                });
                //是否婚配
                if (data.datas.member_marriage == 0) {
                    $('.unmarried').attr('selected', 'selected');
                } else if (data.datas.member_marriage == 1) {
                    $('.married').attr('selected', 'selected');
                } else if (data.datas.member_marriage == 2) {
                    $('.secret2').attr('selected', 'selected');
                }
                //电话
                $('input[name="tel"]').val(data.datas.member_mobile);
				//	修改生日资料
			    $('input[name="birth"]').on('tap', function() {
			        // console.log($(this).val());
			        plus.nativeUI.pickDate(function(e) {
			            var d = e.date,
			                $this = $(this),
			                $date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			
			            $('input[name="birth"]').val($date);
			        }, function(e) {
			            // console.log("未选择日期：" + e.message);
			        });
			    })
				//	保存个人修改信息
				$('.login .icon-link').one('tap', function() {
					$('#loading').show();
					$(this).css('color', '#E4E4E4');
					setTimeout(function(){
						basememInfo();
					},1000);
				});
                //结束上拉下拉刷新
                pullRefresh.endPulldown(true);
            } else {
                pullRefresh.endPulldown(true);
                mui.toast('获取用户信息错误，请重新登陆！');
                OpenW('/tmpl/member/login.html');
            }
        });
    }
}

//	个人导航跳转
var personal = {
    //收藏
    collection: function() {
        var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        }
        openW('/tmpl/member/collection.html');
    },
    //帮助与反馈
    feedback: function() {
    	var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        }
        openW('/tmpl/common/feedback.html');
    },
    //申请入驻
    joins: function() {
    	var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
        openW('/tmpl/member/join.html');
    },
    //邀请有奖
    invite: function() {
    	var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
        openW('/tmpl/member/invite.html');
    },
    //推荐人手机号
    referrer:function(){
    	var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
        openW('/tmpl/member/referrer.html');
    },
    //优惠券
    coupon: function() {
    	var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
        openW('/tmpl/member/coupon.html');
    },
    //设置
    config: function() {
		var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
         openW('/tmpl/member/setting.html');
    },
    //退款售后
    refund: function(status) {
        var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        }
        openW('/tmpl/member/refundcustomerservice.html', 'status', status);
    },
    // 我的订单
    order: function(status) {
        var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
        openW('/tmpl/member/service-order-all.html', 'status', status);
    },
    //消息
    message: function() {
        var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        };
        openW('/tmpl/message/message_list.html');
    }
}

//之前 订单各种状态 点击进入页面  目前隐藏
$('.ucenter-order menu a').on('tap', function() {
    var $this = $(this),
        $index = $this.index(),
        $status = $this.attr('data-status');

    switch ($index) {
        case 0:
            personal.order($status);
            break;
        case 1:
            personal.order($status);
            break;
        case 2:
            personal.order($status);
            break;
        case 3:
            personal.refund();
            break;
        case 4:
            personal.order($status);
            break;
        default:
            mui.alert('错误');
    }
});

// 切换服务商
$('.ucenter-config').on('tap', function() {
    if (!$key) {
        checkLogin(0);
        return;
    } else if ($(this).attr('data-type') == 0) {
        mui.alert('请先申请成为服务商');
    } else {
        _.openWindow({
            url: '../seller/seller.html',
            id: _.pageName.seller,
            reOpen: true
        });
    }
})

//tab栏的每个页面的跳转
$('.ucenter-type').on('tap', 'a', function() {
    switch ($(this).index()) {
        case 0:
            personal.order();
            break;
        case 1:
            personal.collection();
            break;
        case 2:
            personal.feedback();
            break;
        case 3:
            personal.joins();
            break;
        case 4:
            personal.invite();
            break;
        case 5:
            personal.coupon();
            break;
        case 6:
            personal.refund();
            break;
        case 7:
            personal.message();
            break;
        case 8:
        	personal.referrer();
        	break;
        case 9:
            personal.config();
            break;
    }
})

// 个人资料
$('.ucenter-box').on('tap', function() {
    var key = _.userInfo.getKey();
    if (!key) {
        mui.openWindow({
            url: 'login.html',
            id: 'login',
            waiting: {
                autoShow: true
            }
        })
    } else {
        $('.page-info').show().siblings('.page').hide();
    }
    return false;
});

// 修改个人资料
function ProcessFile(e) {
    var file = document.getElementsByClassName('file-person')[0].files[0];
    console.log(JSON.stringify(file));
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var txt = event.target.result;
            $(".person-img").attr("src", txt)
        };
    }
    reader.readAsDataURL(file);
}

function contentLoaded() {
    document.getElementsByClassName('file-person')[0].addEventListener('change', ProcessFile, false);
}

contentLoaded();
//用户等级显示页面
$('.person').on('tap', '.user_lv', function() {
    mui.openWindow({
        url: 'memberlv-detail.html',
        id: 'memberlv-detail',
        extras: {
            articleid: $(this).attr('data-article-id')
        },
        waiting: {
            autoShow: true,
            title: '正在记载...'
        }
    })
})

var arr = [];
//保存个人信息
function basememInfo(){
	if ($(".usernamemax").val() == "") {
        mui.confirm("名称为空")
        return false;
    }
	//修改头像
    var txt1 = $(".person-img").attr("src"),
        $key = _.userInfo.getKey();
		
      console.log("图片"+encodeURIComponent(txt1));
    $.ajax({
        url: ApiUrl + "/index.php?act=member_account&op=editMemberAvatar",
        type: "post",
        dataType: 'json',
        async: false,
        data: {
            key: $key,
            member_avatar: encodeURIComponent(txt1),
            globalLoading: true
        },
        
        success: function(res) {
            if (res.code == 200) {
            	console.log("res==="+res);
//          	mui.toast('修改头像成功');
				var msg = {};
            	msg.status = true;
            	msg.msg = '修改头像成功';
            	arr.push(msg);
            	
                $('.person-img').attr('src', res.datas.member_avatar);
                $('.ucenter-box img').attr('src', res.datas.member_avatar);
            } else {
            	var msg = {};
            	msg.status = false;
            	msg.msg = res.datas.error;
            	arr.push(msg);
//              mui.toast(res.datas.error);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			mui.alert('网络错误，头像修改失败');
		}
    })
    var
        $name = $('input[name="name"]').val(),
        $photo = $('.form-upload img').attr('src'),
        $sex = $('#sex').val(),
        $birth = $('input[name="birth"]').val();

    var $national = nationaldata[$('#national').val()];
    var $marriage = $('#marriage').val();
	//	修改用户名
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_account&op=editMemberName",
        async: false,
        dataType: 'json',
        data: {
            key: $key,
            member_name: $name,
            globalLoading: true
        },
        success: function(data) {
            console.log(data)
            if (data.code == 200) {
//          	mui.toast('修改用户名成功');
				var msg = {};
            	msg.status = true;
            	msg.msg = '修改用户名成功';
            	arr.push(msg);
            	
                $('.ucenter-box h2').text($name);
                _.userInfo.updateName($name);
            } else {
            	var msg = {};
            	msg.status = false;
            	msg.msg = data.datas.error;
            	arr.push(msg);
//              mui.toast(data.datas.error);
            }
        },
        error: function(err) {
            mui.alert('网络异常，请稍后重试');
        }
    });

    $('input[name="birth"]').on('tap', function() {
        plus.nativeUI.pickDate(function(e) {
            var d = e.date,
                $this = $(this),
                $date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

            $('input[name="birth"]').val($date);
        }, function(e) {
            console.log("未选择日期：" + e.message);
        });
    })

    //	修改基本资料
    $.ajax({
        url: ApiUrl + '/index.php?act=member_account&op=editMemberInfo',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            key: $key,
            member_sex: $sex,
            member_birthday: $birth,
            member_national: $national,
            member_marriage: $marriage,
            globalLoading: true
        },
        success: function(data) {
        	var msg = {};
            console.log(JSON.stringify(data));
            if (data.code == 200) {
//              mui.toast("修改个人资料成功");
            	msg.status = true;
            	msg.msg = '修改个人资料成功';
            } else {
            	msg.status = false;
            	msg.msg = data.datas.error;
//              mui.toast(data.datas.error);
            }
            arr.push(msg);
            
//          console.log(JSON.stringify(arr));
        },
        error: function(){
        	mui.alert("网络异常，请稍后重试");
        }
    })
    console.log(JSON.stringify(arr));
    
    /**
	 *@author: zhaoyangyue
	 * @des: 由于调用接口较多 不一一弹出提示
	 */
    for(var i = 0;i < arr.length;i++){
    	if(!arr[i].status){
    		mui.toast(arr[i].msg);
    	}
    }
    if(arr[0].status && arr[1].status && arr[2].status){
		mui.alert('修改资料成功');
	}
    pullRefreshdown();
    $('.page-info').fadeOut().siblings('.page').fadeIn();
    $('.login .icon-link').removeAttr('disabled').css('color', 'orangered');
}

//个人资料返回member页
$('.page-info .icon-back').on('tap', function() {
    $('.page-info').hide();
    $('.page-member').fadeIn();
})

//页脚菜单
$('footer a').on('tap', function() {

    var $this = $(this),
        $index = $this.index();

    switch ($index) {
        case 0:
            //直接回到首页，首页的id并不是index
            mui.openWindow({
                url: '../../index.html',
                id: '1',
                waiting: {
                    autoShow: true,
                    title: '正在加载...'
                }
            })
            break;
        case 3:
            var key = _.userInfo.getKey();
            if (!key) {
                checkLogin(0);
                return;
            }
            mui.openWindow({
                url: '../../tmpl/common/feedback-content.html',
                id: _.pageName.publish_needs_step1,
                waiting: {
                    autoShow: true,
                    title: '正在加载...'
                }
            })
            break;
        case 2:
            var key = _.userInfo.getKey();
            if (!key) {
                checkLogin(0);
                return;
            }
            mui.openWindow({
                url: 'publish_needs_step1.html',
                id: _.pageName.publish_needs_step1,
                waiting: {
                    autoShow: true,
                    title: '正在加载...'
                }
            })
            break;
            case 1:
            var key = _.userInfo.getKey();
            if (!key) {
                checkLogin(0);
                return;
            }
            mui.openWindow({
                url: '../../tmpl/land.html',
				id: 'land',
                waiting: {
                    autoShow: true,
                    title: '正在加载...'
                }
            })
            break;
            
    }

})

