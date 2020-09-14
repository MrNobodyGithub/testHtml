'use strict';
// var sinfo = _.storeInfo.get();
// var $userinfo = _.userInfo.get();
// var $key = _.userInfo.getKey();
// var display = sinfo.isAdmin || 0;

/*
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
*/


var $key = _.userInfo.getKey();
console.log($key);
/**
 * @author:zhaoyangyue
 * @version: 2017-8-1
 * @description:在加载前先去本地缓存填充头像和店铺名
 */
var sInfo = _.storeInfo.get();
console.log("======" + JSON.stringify(sInfo));
var display = sInfo.is_admin || 1;
if (sInfo != '') {
    //店铺名显示
    $('.ucenter-box').find('h2').text(sInfo.storeName);
    //店铺头像
    $('.ucenter-box').find('img').attr('src', sInfo.photo);
    if (display == 0) {
        $('#a1').css('display', 'none');
        $('#a3').css('display', 'none');
        $('#a4').css('display', 'none');
        $('#a8').css('display', 'none');
    }
}
/*************************************************************************/
mui.init({

    swipeBack: true,
    pullRefresh: {
        container: '.robOrder',

        down: {
            style: 'circle',
            color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: false, //可选,默认false.首次加载自动上拉刷新一次
            callback: pulldownRefresh
        },
        up: {
            height: 50, //可选.默认50.触发上拉加载拖动距离
            auto: false, //可选,默认false.自动上拉加载一次
            contentrefresh: "正在加载...", //可选，正在 加载状态时，上拉加载控件上显示的标题内容
            contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});
// plus
mui.plusReady(function() {
		// 动态改变webview的侧滑返回功能：
	
	var wv = plus.webview.currentWebview(); 
	
	// 关闭侧滑返回功能
	
	wv.setStyle({
	
	'popGesture': 'none'
	
	});
	
    plus.webview.close('register');
    plus.webview.close('login');
    loadStoreinfo();
    
})
window.addEventListener('loaddata', function(event) {
    pullRefreshdown();
})

//下拉刷新
function pulldownRefresh() {
    console.log('店铺刷新页面');
//  mui.plusReady(function() {
        loadStoreinfo();
        getListData(1, 0);
//  });
}
//上拉更多
function pullupRefresh() {
    var curpage = parseInt($('.robOrder-list').data("data-current-page")) || 0;
    curpage++;
    getListData(curpage, 1);
}

function getListData(curpage, pullDirect) {
    pullDirect = pullDirect || 0; //默认下拉
    curpage: Number(curpage) || 1;
    var pullRefresh = mui('.robOrder').pullRefresh();
    var param = {
        key: $key,
        curpage: curpage,
        page: 10,
        search_type: 1,
        response_type: 1
    };
    console.log(JSON.stringify(param));
    $.ajax({
        type: 'get',
        url: ApiUrl + '/index.php?act=service_needs&op=to_response_needslist',
        data: param,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            var html = template('order-item', data);
            if (curpage == 1) {
                $('.robOrder-list').html(html);
                pullRefresh.refresh(true); //恢复滚动
                pullRefresh.scrollTo(0, 0, 100); //滚动置顶
            } else {
                $('.robOrder-list').append(html);
            }
            $('.robOrder-list').data("data-current-page", curpage);

            var hasmore = data.hasmore || false;
            if (curpage == 1) {
                if (hasmore) {
                    pullRefresh.enablePullupToRefresh();
                } else {
                    pullRefresh.disablePullupToRefresh();
                }
            }
            if (pullDirect == 1) {
                pullRefresh.endPullupToRefresh(!hasmore);
            } else {
                pullRefresh.endPulldownToRefresh(true);
            }
        },
        error: function(xhr, type) {
            if (pullDirect == 1) {
                pullRefresh.endPullupToRefresh(true);
            } else {
                pullRefresh.endPulldownToRefresh(true);
            }
            mui.toast('网络异常,请稍候再试');
        }
    });
}

function loadStoreinfo() {
    // 根据key请求一次数据
    if (!$key) {
        $('body').removeClass('login');
        $('#loading').fadeOut();
    } else {
        $('body').addClass('login');
        var
            $url = ApiUrl + '/index.php?act=member_account&op=getMemberInfo',
            $data = {
                key: $key
            },
            $load = true;
        _.data.send($url, 'get', $load, $data, function(data) {
            if (data.code == 200) {

                var $state = data.datas.member_vstate,
                    $ident = $('.ucenter-ident');

                if ($state == "10") {
                    $ident.text("未提交").on('tap', function() {
                        mui.openWindow({
                            url: "../member/authentication.html",
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
                        mui.openWindow({
                            url: "../member/authentication.html",
                            waiting: {
                                autoShow: true,
                                title: '正在加载...'
                            }
                        });
                    });
                }

                var display = data.datas.store_info.is_admin || 1;
                console.log("display--" + display);
                if (display == 0) {
                    $('#a1').css('display', 'none');
                    $('#a3').css('display', 'none');
                    $('#a4').css('display', 'none');
                    $('#a8').css('display', 'none');
                }

                //每次下拉重新存储本地缓存
                _.userInfo.clear();
                _.storeInfo.clear();
                data.datas.key = $key;
                _.userInfo.set(data.datas);
                _.storeInfo.set(data.datas);
                console.log()

                var $box = $('.ucenter-box'),
                    $nav = $('.ucenter-nav'),
                    $sex;

                console.log("store_info===" + JSON.stringify(data.datas.store_info));
                console.log("get---store_描述===" + JSON.stringify(data.datas.store_info.store_intro));
                //商铺logo
                if (data.datas.store_info) {
                    $box.find('img').attr('src', data.datas.store_info.store_avatar);
                } else {
                    $box.find('img').attr('src', data.datas.member_avatar);
                }
                // 商铺名称
                $box.find('h2').text(data.datas.store_info.store_name);

                var store_evaluate = data.datas.store_info.store_credit_percent; //好评率
                var storeSales = data.datas.store_info.store_sales; //接单率
                //				$(".ucenter-nav").find("a").eq(0).find("span").text(storeSredit_average);
                $(".ucenter-nav").find("a").eq(1).find("span").text(store_evaluate +"%");
                $(".ucenter-nav").find("a").eq(2).find("span").text(storeSales + "%");


                // 商铺资料填写
                // 店铺头像
                $('.form-upload img').attr('src', data.datas.store_info.store_avatar);
                // 店铺名名
                $('input[name="name"]').val(data.datas.store_info.store_name);
                // 店铺描述
                $('input[name="describe"]').val(data.datas.store_info.store_intro);
                // 民族
                $("#national option").each(function() {
                    if ($(this).text() == data.datas.member_nation) {
                        $(this).attr("selected", true);
                    }
                });
                 // 性别
                 $("#sex option").each(function() {
                    if (data.datas.member_sex && $(this).value == data.datas.member_sex) {
                        $(this).attr("selected", true);
                    }
                });
                // 手机号
                $('input[name="tel"]').val(data.datas.member_mobile);
                var storeId = data.datas.store_info.store_id;
                //店铺星级评价列表
                $('.star').on('tap', function() {
                    mui.openWindow({
                        url: 'evaluate-my.html',
                        id: 'store_comment_list',
                        extras: {
                            store_id: storeId
                        },
                        waiting: {
                            autoShow: true,
                            title: '正在加载...'
                        }
                    })
                })
                
                //	修改基本资料
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
                //	修改
				$('.login .icon-link').one('tap', function() {
				    $('#loading').show();
					$(this).css('color', '#E4E4E4');
				    setTimeout(function(){
						changeBasicinfor();
					},1000);
				});
            } else {
                mui.toast('获取用户信息错误，请重新登陆！');
                _.openWindow({
                    url: "../member/login.html",
                    id: _.pageName.login,
                    reOpen: true,
                    closeOthers: true
                })
            }
        });
    }
}

// 个人资料
$('.ucenter-box').on('tap', function() {
    var $this = $(this).find('h2').text();
    if ($.trim($this) == '请登录') {
        checkLogin(0);
        return;
    } else {
        $('.page-info').show().siblings('.page').hide(); $('.page-info').show().siblings('.page').hide();
    }
    return false;
});

// 切换服务商和店铺
$('.ucenter-config').on('tap', function() {
    if (!$key) {
        checkLogin(0);
        return;
    } else {
        _.openWindow({
            url: '../member/member.html',
            id: _.pageName.member,
            reOpen: true
        });
    }
})

// 订单状态 隐藏
$('.login .ucenter-order menu a').on('tap', function() {

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
            plus.nativeUI.alert('错误');
    }
});

function openW(url, id) {
    mui.openWindow({
        url: url,
        id: id,
        waiting: {
            autoShow: true
        }
    })
}

var service = {

    order: function() {
        openW('seller-order-all.html', 'seller-order');
    },

    merchants: function() {
        openW('../member/newbuildmer.html', 'newbuildmer');
    },

    list: function() {
        openW('service-list.html', 'service-list');
    },

    account: function() {
        openW('account-my1.html', 'my-account');
    },

    history: function() {

    },

    invite: function() {
        openW('../member/invite.html', 'intive');
    },

    addClerk: function() {
        openW('../member/addClerk.html', 'addClerk');
    },

    refund: function() {

    },

    feedback: function() {
        openW('../common/feedback.html', 'feedback');
    },

    config: function() {
        openW('../member/setting.html', 'config');
    },

    message: function() {
        var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        }
        _.openWindow({
            url: '/tmpl/message/message_list.html',
            id: _.pageName.message_center,
            reOpen: true,
            autoShow: false
        });
    }
}

$('.ucenter-menu a').on('tap', function() {

    var $this = $(this),
        $index = $this.index();

    switch ($index) {
        case 0:
            service.account();
            break;
        case 1:
            service.order();
            break;
        case 2:
            service.list();
            break;
        case 3:
            service.merchants();
            break;
        case 4:
            service.history();
            break;
        case 5:
            service.invite();
            break;
        case 6:
            service.addClerk();
            break;
        case 7:
            service.refund();
            break;
        case 8:
            service.feedback();
            break;
        case 9:
            service.message();
            break;
        case 10:
            service.config();
            break;
    }

})

// 修改个人资料

function ProcessFile(e) {
    var file = document.getElementsByClassName('file-person')[0].files[0];
    // console.log(file)
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



//店铺资料修改
var arr = [];
function changeBasicinfor() {
	if ($(".usernamemax").val() == "") {
        mui.confirm("名称为空")
        return false;
    }
    console.log("提交用户名时描述参数-- "+ $('input[name="describe"]').val());
    //修改头像
    var txt1 = $(".person-img").attr("src"),
        $key = _.userInfo.getKey();
    $.ajax({
        url: ApiUrl + "/index.php?act=member_account&op=editMemberAvatar",
        type: "post",
        dataType: 'json',
        async: false,
        data: {
            key: $key,
            member_avatar: encodeURIComponent(txt1),
            store_type: '1'
        },
        success: function(res) {
            console.log("图片上传返回JSON.stringify(res)");
            console.log(JSON.stringify(res));
            if (res.code == 200) {
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
            	
                console.log("店铺logo失败"+  JSON.stringify(res));
            }
        },
        error: function(err) {
            console.log("头像error" + JSON.stringify(err));
        }
    })

    var
        $name = $('input[name="name"]').val(),
        $describe = $('input[name="describe"]').val();

        
    //	修改用户名
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_account&op=editStore",
        async: false,
        dataType: 'json',
        data: {
            key: $key,
            store_name: $name,
            store_intro: $describe
        },
        success: function(data) {
            if (data.code == 200) {
                // mui.alert("店铺名修改成功");
                var msg = {};
            	msg.status = true;
            	msg.msg = '修改用户名成功';
            	arr.push(msg);
            	
                $('.ucenter-box h2').text($name);
                console.log("('.ucenter-box h2').text($name);" + $name);
                _.userInfo.updateStoreName($name);
            } else {
            	var msg = {};
            	msg.status = false;
            	msg.msg = data.datas.error;
            	arr.push(msg);
            	
                console.log("店铺名修改失败"+  JSON.stringify(data));
            }
        },
        error: function(err) {
            console.log("店铺名error" + JSON.stringify(err));
        }
    });

    //	修改基本资料
//  var $national = nationaldata[$('#national').val()];
//  var $marriage = $('#marriage').val();
//  var $sex = $('#sex').val();
//  var $birth = $('input[name="birth"]').val();
//  $.ajax({
//      url: ApiUrl + '/index.php?act=member_account&op=editMemberInfo',
//      type: 'post',
//      dataType: 'json',
//      data: {
//          key: $key,
//          member_sex: $sex,
//          member_birthday: $birth,
//          member_national: $national,
//          member_marriage: $marriage
//      },
//      success: function(data) {
//          if (data.code == 200) {
//              // mui.alert("修改基本资料成功");
//              // window.location.reload();
//          } else {
//              console.log("修改基本资料失败" + JSON.stringify(data));
//          }
//      },
//      error: function(err) {
//          console.log("修改基本资料error" + JSON.stringify(err));
//      }
//  });
	
	/**
	 *@author: zhaoyangyue
	 * @des: 由于调用接口较多 不一一弹出提示
	 */
	for(var i = 0;i < arr.length;i++){
    	if(!arr[i].status){
    		mui.toast(arr[i].msg);
    	}
    }
    if(arr[0].status && arr[1].status){
		mui.alert('修改店铺资料成功');
	}
    $('.page-info').show().siblings('.page').hide(); $('.page').show().siblings('.page-info').hide();
    pulldownRefresh();
    $('.login .icon-link').css('color', 'orangered');
}

$('.page-info .icon-back').on('tap', function() {
    $('.page-info').hide();
    $('.page-member').fadeIn();
})

//测试

$('footer a').on('tap', function() {

    var $this = $(this),
        $index = $this.index();

    switch ($index) {
        case 0:
            _.toHomePage();
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
                url: '../member/publish_needs_step1.html',
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

//点击抢单  切换

$('.tab-header a').on('tap', function() {
    var $this = $(this),
        $index = $this.index();

    $this.addClass('active').siblings().removeClass('active');
    $('.tab-content').eq($index).show().siblings('.tab-content').hide();
    if ($index == 1) {
        pulldownRefresh();
    }
})

//切换二级分类

$('.tab-three a').on('tap', function() {
    var $this = $(this),
        $index = $this.index();

    $this.addClass('active').siblings().removeClass('active');
    $('.suborder').eq($index).show().siblings('.suborder').hide();
    //二级分类暂时没了
})

//点击抢单提交信息

$(".tab-content").on("tap", ".robOrder1", function() {
    console.log($key);
    //	console.log($(this).attr("needid"))
    var _this = $(this);
    var needs_id = $(this).attr("needid");

    //通过mui.confirmlaipanduan 是否抢单
    var btnArray = ['否', '是'];
    mui.confirm('是否确定抢单？', '', btnArray, function(e) {
        if (e.index == 1) {
            $.ajax({
                type: "post",
                url: ApiUrl + "/index.php?act=service_needs&op=needs_response",
                data: {
                    key: $key,
                    needs_id: needs_id
                },
                success: function(res) {
                    var data = JSON.parse(res);
                    _this.parent().parent().remove()
                    if (data.code == 200) {
                        mui.toast("抢单成功");
                        pulldownRefresh();
                    } else {
                        mui.toast(data.datas.error);
                    }
                }
            });
        }
    })
})

//点击进入详情
$(".robOrder-list").on("tap", ".info-detail", function() {
    console.log("$(this).attr('orderid')");
    console.log($(this).attr('data-id'));
    console.log($(this).html());
    mui.openWindow({
        url: "../order/grab-details.html",
        extras: {
            orderId: $(this).attr('data-id'),
        },
        waiting: {
            autoShow: true,
            title: "正在加载..."
        }
    })
})