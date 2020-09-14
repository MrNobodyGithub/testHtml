


var key = _.userInfo.get();
var $phone = $("icon-tel").val()	


$('.config-top input').blur(function(){
	
	
})

var isYes = true;
//是否显示密码
$('.reg-content').on('tap', '.form-control .eye_icon', function(){
	console.log(this);
	if(isYes){
		$(this).addClass("active_eye");		
		$(this).parent().find('input').attr('type', 'text');
		isYes = false;
	}else{
		$(this).removeClass("active_eye");
		$(this).parent().find('input').attr('type', 'password');
		isYes = true;
	}
})

//获取验证码
$('.reg-get').on('tap', function(){
	var $forgetUrl = ApiUrl+"/index.php?act=login&op=send_sms_msg";
	$phone = $('.icon-tel').val();
	console.log($phone);
	var num = 60;
	var timer = null;
	var $this = $(this);
	$.ajax({
		type:"post",
		url:$forgetUrl,
		async:true,
		data: {
			phone: $phone,
			type: 3
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


$('.submit').on('tap',function(){
	
	//	提交
	var	
		$userinfo 			= 	new Object(),
		$phone              =   $('.icon-tel').val();
		$password 			= 	$('.icon-pass').val(),
		$password_confirm	=	$('.icon-pass1').val(),
		$vcode 				= 	$('.icon-confirm').val(),
		$url 				=	ApiUrl+"/index.php?act=login&op=forget_password";
		
		console.log($phone);
		console.log($vcode);
		
		if($phone==""&&$password==""&&$password_confirm==""&&$vcode=="") {
			mui.alert("不能为空");
			return false;
			
		}else if(!(/^1(3|4|5|7|8)\d{9}$/.test($phone))){
			mui.alert("请输入正确的手机号");
			return false;
		}else if($password.length < 6){
			mui.alert("密码长度不能小于6位");
			return false;
			
		}else if($password!=$password_confirm){
			mui.alert("两次密码不一致");
			return false;
		}else if($vcode.length != "6"){
			mui.alert("验证码长度为6位")
		}
		
		
		
	$.ajax({
		type:"post",
		url:$url,
		dataType: 'json',
		data: {
			member_mobile: $phone,
			password: $password,
			password_confirm: $password_confirm,
			vcode: $vcode,
			client: 'ios'
		},
		success: function(data) {
			console.log(data);
			if( data.code == 200 ) {				
				mui.alert("修改成功")
				mui.openWindow({
					url: 'login.html',
					id: 'login',
					waiting: {
						autoShow: true
					}
				})
			} else if(data.code == 400){
				console.log(data.datas.error);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
	
})

