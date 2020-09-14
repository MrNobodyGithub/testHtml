$(function() {
	//全局的client类型变量，后面再plusready后面处理
	var $client = 'wap';
	var ApiUrl = "http://test.hisunflower.com/mobile";
	var WapSiteUrl = 'http://127.0.0.1:8020/wap_xrk';
	//跳转协议
    $('.form-check a').on('tap',function(){
		$('.form-agreement').fadeIn();
		window.location = "#foot"; //直接跳转页面底部
		$('.login').hide();
    })
    
    $('.form-agreement .icon-back').on('tap',function(){
		$('.form-agreement').fadeOut();
		$('.login').fadeIn();
    })
	
	$.ajax({
		url: ApiUrl+"/index.php?act=document&op=getagreement&doc_code=register",
		type: "GET",
		data:{
			doc_code:self.doc_code
		},
		success: function(res){
			var data = $.parseJSON(res);
			var html = data.datas.doc_row.doc_content;
			$(".agreement-text").find("p").html(html)
			
		}
	})
    _.ST.cls(); //进入登录页面先把所有本地存储清理  以防退出登录清理不干净
    function registerPush() {
        //注册个推信息到服务器
        var info = plus.push.getClientInfo();
        _.debug(info);
        //提交用户id到服务器
        $.ajax({
            type: "post",
            url: ApiUrl + '/index.php?act=push&op=registerPush',
            data: {
                key: _.userInfo.getKey(),
                client_id: info.clientid
            },
            dataType: 'json',
            success: function(data) {
                _.debug(data);
            }
        })
    }

    /*var isYes = true;
    //是否显示密码
    $('.form-control').on('tap', '.eye_icon', function(){
    	if(isYes){
    		$(this).addClass("active_eye");		
    		$('.form-control .icon-password').attr('type', 'text');
    		isYes = false;
    	}else{
    		$(this).removeClass("active_eye");
    		$('.form-control .icon-password').attr('type', 'password');
    		isYes = true;
    	}
    })*/
    // 获取验证码
   _.getConfirmmsg('username', 2);


    $('.box-button').on('tap', function() {

        if ($('.icon-username').val() == '') {
            mui.alert('用户名不能为空');
            return false;
        }

        if ($('#confirm').val() == '') {
            mui.alert('验证码不能为空');
            return false;
        }
		
		if (!$(".loginchek").is(':checked')) {
	       	mui.alert("请同意用户服务协议")
	       	return false;
        }
        // 变量start
        var
            $username = $('input[name="username"]').val(),
            $yzm = $('input[name="yzm"]').val(), //验证码
            $url = ApiUrl + '/index.php?act=login';
        console.log($yzm);
        // 请求开示
//      plus.nativeUI.showWaiting();
        $.ajax({
            type: "post",
            url: $url,
            data: {
                //修改验证码参数
                username: $username,
                vcode: $yzm,
                client: $client
            },
            dataType: 'json',
            success: function(data) {
//              plus.nativeUI.closeWaiting();
                if (data.code == 200) {
                    $('.icon-password').val('');
                    var res = data.datas;
                    console.log("用户信息：" + JSON.stringify(res));
                    _.ST.cls();
                    _.userInfo.set(res);
                    _.storeInfo.set(res);


                    //console.log(JSON.stringify(_.userInfo.get()));
                    //登录后出发会员中心的数据加载事件
//                  mui.plusReady(function() {
                        //注册推送id
//                      registerPush();
                        //找到首页，执行连接通讯服务js
//                      var indexpage = plus.webview.getLaunchWebview();
//                      indexpage && mui.fire(indexpage, 'connect_chatServer');
                        //evalJS打包不好用
                        //indexpage&&indexpage.evalJS("connect_chatServer();");
                        //
//                      var member_Page = plus.webview.getWebviewById('member');
//                      if (member_Page) {
//                          mui.fire(member_Page, 'loaddata');
//                      }
                        //登录成功，跳转的页面应该根据条件来跳转。
                        console.log(JSON.stringify(_.storeInfo.get()));
                        var storeInfo = _.storeInfo.get();
                        if (storeInfo && storeInfo.storeId) {
                        	location.href = encodeURI(WapSiteUrl+'/tmpl/seller/seller.html');
//                          mui.openWindow({
//                              url: '../seller/seller.html',
//                              id: 'seller',
//                              waiting: {
//                                  autoShow: true
//                              }
//                          })
                        } else {
                            window.location.href = WapSiteUrl + 'index.html';
                        }
//                  })

                } else if (data.code == 400) {
                    mui.alert(data.datas.error);
                    console.log("======" + data.datas.error);
                }

            },
            error: function(err) {
//              plus.nativeUI.closeWaiting();
                mui.toast('网络异常');
                console.log(err);
            }
        })

    })

    // 跳转到注册
    //	$('.form-reglink a').on('tap', function() {
    //		mui.openWindow({
    //			url: 'register.html',
    //			id: 'register',
    //			waiting: {
    //				autoShow: true,
    //				title: '正在加载...'
    //			}
    //		})
    //	})

    //忘记密码
    //	$('.form-forget1').on('tap', function() {
    //		mui.openWindow({
    //			url: 'forgetPassword.html',
    //			id: 'forgetPassword',
    //			waiting: {
    //				autoShow: true,
    //				title: '正在加载...'
    //			}
    //		})
    //	})

    /**
     * 增加登陆页自动选择下一项、自动登录功能 -start
     * @author zhaobing
     * @version 2017年7月12日10:54:55
     */
    function enterfocus(selector, callback) {
        var boxArray = [].slice.call(document.querySelectorAll(selector));
        for (var index in boxArray) {
            var box = boxArray[index];
            box.addEventListener('keyup', function(event) {
                if (event.keyCode == 13) {
                    var boxIndex = boxArray.indexOf(this);
                    if (boxIndex == boxArray.length - 1) {
                        if (callback) callback();
                    } else {
                        //console.log(boxIndex);
                        var nextBox = boxArray[++boxIndex];
                        nextBox.focus();
                    }
                }
            }, false);
        }
    }
    enterfocus('.form-group input', function() {
        $(".box-button").trigger('tap');
    });
    /**增加登陆页自动选择下一项、自动登录功能 -end*/
   // 获取登录认证通道
    function thirdLogin(auth){
		//console.log(JSON.stringify(auth));
		var w=null;
		//if(plus.os.name=="Android"){
			w=plus.nativeUI.showWaiting();
		//}
		auth.login(function(){
		w&&w.close();w=null;
		console.log(JSON.stringify(auth.authResult));
		getUserInfo(auth);
		},function(e){
			w&&w.close();w=null;
			console.log("登录认证失败：["+e.code+"]："+e.message);
		});
	}
	function getUserInfo(auth){
			auth.getUserInfo(function(){
			console.log("获取用户信息成功：");
			console.log(JSON.stringify(auth.userInfo));
			var nickname=auth.userInfo.nickname||auth.userInfo.name||auth.userInfo.miliaoNick;
			console.log("欢迎“"+nickname+"”登录！");
			if(auth.id == 'qq'){
				auth.userInfo.openid = auth.authResult.openid;
			}
			$.ajax({
				url: ApiUrl + '/index.php?act=connect_app&op=third_login',
				type: "post",
				dataType: 'json',
				data: {
	                client: $client,
	                kind: auth.id,
	                user_info:JSON.stringify(auth.userInfo)
            	},
            	success:function(ret){
            		console.log(JSON.stringify(ret));
            		if(ret.code == 200){
            			if(ret.datas.state == 1){
            				//正常登陆
            				var member_info = ret.datas.member_info;
            				console.log("用户信息：" + JSON.stringify(member_info));
		                    _.ST.cls();
		                    _.userInfo.set(member_info);
		                    _.storeInfo.set(member_info);
		                    //注册推送id
	                        registerPush();
	                        //找到首页，执行连接通讯服务js
	                        var indexpage = plus.webview.getLaunchWebview();
	                        indexpage && mui.fire(indexpage, 'connect_chatServer');
	                        var member_Page = plus.webview.getWebviewById('member');
	                        if (member_Page) {
	                            mui.fire(member_Page, 'loaddata');
	                        }
	                        //登录成功，跳转的页面应该根据条件来跳转。
	                        console.log(JSON.stringify(_.storeInfo.get()));
	                        var storeInfo = _.storeInfo.get();
	                        if (storeInfo && storeInfo.storeId) {
	                            mui.openWindow({
	                                url: '../seller/seller.html',
	                                id: 'seller',
	                                waiting: {
	                                    autoShow: true
	                                }
	                            })
	                        } else {
	                            plus.webview.getLaunchWebview().show();
	                        }
            			} else {
            				//进入绑定手机页面
            				mui.openWindow({
	                                url: 'member_bindmobile.html',
	                                id: 'member_bindmobile',
	                                extras: {
						                user_info: JSON.stringify(auth.userInfo),
						                kind:auth.id
						            },
	                                waiting: {
	                                    autoShow: true
	                                }
	                            })
            			}
            		} else {
            			mui.toast(ret.datas.error);
            		}
            	},
            	error:function(){
            		mui.toast('服务器开小差了');
            	}
			})
		},function(e){
			console.log("获取用户信息失败：["+e.code+"]："+e.message);
		});
	}
//  mui.plusReady(function() {
//  	//处理
//  	$client = plus.os.name.toLowerCase();
//
//		plus.oauth.getServices(function(services){
//			for(var i in services){
//				var service=services[i];
//				//console.log(service.id+": "+service.authResult+", "+ service.description +", "+ service.userInfo);
//				switch (service.id){
//					case "weixin":
//						$('.icon-wx').addClass('active');
//						(function(auth){
//							$('.icon-wx').on('tap',function(e){
//								e.preventDefault();
//								thirdLogin(auth);
//							})
//						})(service);
//						break;
//					case "qq":
//						$('.icon-qq').addClass('active');
//						(function(auth){
//							$('.icon-qq').on('tap',function(e){
//								e.preventDefault();
//								thirdLogin(auth);
//							})
//						})(service);
//						break;
//					case "sinaweibo":
//						$('.icon-wb').addClass('active');
//						(function(auth){
//							$('.icon-wb').on('tap',function(e){
//								e.preventDefault();
//								thirdLogin(auth);
//							})
//						})(service);
//						break;
//					default:
//						break;
//				}
//			}
//		},function(e){
//			console.log("获取登录认证失败："+e.message);
//		});
//	})
})