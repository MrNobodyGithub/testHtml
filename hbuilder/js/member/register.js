$(function(){

//	$('.form-register ').on('click',".register-agreement",function(){
//		$('.form-register').hide();
//		$('.form-agreement').show();
//	})
//	$('.form-agreement').on('click',".icon-back",function(){
//		$('.form-agreement').hide();
//		$('.form-register').show();
//	})

    // 清空st
    _.ST.cls();

    // 验证码倒计时
    $('.yzm').on('tap',function(){
        if( $('input[name="username"]').val().length != 11 ) {
            mui.alert('请输入正确的手机号码');
            return false;
        }
		
        var $regUrl = ApiUrl + "/index.php?act=login&op=send_sms_msg";
        var $phone = $('.icon-username').val();
        var $this = $(this);
        var num = 60;
        var timer = null;
        console.log($phone);
        $.ajax({
            type:"post",
            url:$regUrl,
            async:true,
            data: {
                phone: $phone,
                type: 1
            },
            success: function(res){
                var data = JSON.parse(res);
                if(data.code == 200){
                    timer = setInterval(function(){
                        num--;
                        $this.prop('disabled',true).html(num+"秒后重发");
                        if(num == 0){
                            clearInterval(timer);
                            $this.prop('disabled',false).html("获取验证码");
                            num = 60;
                        }
                    }, 1000);
                    console.log(num);
                }else if(data.code == 400){
                    mui.alert(data.datas.error);
                }
            },
            error: function(err){
                console.log(err);
            }
        });

    })
    var isYes = true;
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
	})
	
	
    // 登录验证
    $('.box-button').on('click',function(){
       if (!$(".regcheck").is(':checked')) {
       	mui.alert("请同意用户服务协议")
       	return false;
       }
       
        if (!$(".regcheck").is(':checked')) {
	       	mui.alert("请同意用户服务协议")
	       	return false;
	    }
       
       
       
		var	
            $userinfo 			= 	new Object(),
            $storeinfo 			= 	new Object(),
            $member_mobile 		=  	$('.icon-username').val(),
            $password 			= 	$('.icon-password').val(),
            $vcode 				= 	$('.icon-email').val(),
            $url 				=	ApiUrl + '/index.php?act=login&op=appRegister';

        $.ajax({
            type:"post",
            url:$url,
            dataType: 'json',
            data: {
                member_mobile: $member_mobile,
                password: $password,
                vcode: $vcode,
                client: 'wap'
            },
            success: function(data) {
                if( data.code == 200 ) {
                    var res = data.datas;
					_.userInfo.set(res);

                    //注册后直接登录后出发会员中心的数据加载事件
					mui.plusReady(function(){
						var member_Page = plus.webview.getWebviewById('member');
						if(member_Page){
							mui.fire(member_Page, 'loaddata');
						}
						mui.openWindow({
	                   		url: 'member.html',
	                   		id: 'member',
	                   		waiting: {
	                   			autoShow: true
	                   		}
                   		})
					})
                
                } else if( data.code == 400 ) {
                    mui.alert(data.datas.error);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
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
    
    $('.form-reglink a').on('tap',function(){
    		mui.openWindow({
    			url: 'login.html',
    			id: 'login',
    			waiting: {
    				autoShow: true
    			}
    		})
    })
    
    //跳转协议
    $('.form-check a').on('tap',function(){
    		$('.form-agreement').fadeIn();
    		window.location = "#foot"; //直接跳转页面底部
    		$('.form-register').hide();
    })
    
    $('.form-agreement .icon-back').on('tap',function(){
    		$('.form-agreement').fadeOut();
    		$('.form-register').fadeIn();
    })
})