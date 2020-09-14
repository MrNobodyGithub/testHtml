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
        $.ajax({
            type: "post",
            url: $url,
            data: {
                username: $username,
                vcode: $yzm,
                client: $client
            },
            dataType: 'json',
            success: function(data) {
                if (data.code == 200) {
                    $('.icon-password').val('');
                    var res = data.datas;
                    console.log("用户信息：" + JSON.stringify(res));
                    _.ST.cls();
                    _.userInfo.set(res);
                    mui.openWindow({
                        url: 'tmpl/publish_needs_step2.html',
                        id: 'seller',
                        waiting: {
                            autoShow: true
                        }
                    })
                       
                } else if (data.code == 400) {
                    mui.alert(data.datas.error);
                }

            },
            error: function(err) {
                mui.toast('网络异常');
            }
        })

    })
})
