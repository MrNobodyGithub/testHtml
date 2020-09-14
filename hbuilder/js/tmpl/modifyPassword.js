


var key = _.userInfo.get();
	
if( key ) {
	window.localStorage.removeItem('userinfo');
}

$('.config-top input').blur(function(){
	
	
})

$('.submit').on('tap',function(){
	
	//	提交
	var	
		$userinfo 			= 	new Object(),
		$password 			= 	$('.icon-pass').val(),
		$password_confirm	=	$('.icon-pass1').val(),
		$vcode 				= 	$('.icon-confirm').val() ? $('.icon-confirm').val() : '1111',
		$url 				=	ApiUrl+"/index.php?act=member_account&op=editPassword";
		
		
		if($password==""&&$password_confirm=="") {
			alert("不能为空");
			return false;
		}else if($password.length < 6){
			alert("输入密码");
			return false;
			
		}else if($password_confirm.length < 6){
			alert("确认密码");
			return false;
			
		}else if($password!=$password_confirm){
			alert("密码不一致");
			return false;
		}
		
		
		
	$.ajax({
		type:"post",
		url:$url,
		dataType: 'json',
		data: {
			key: key.key,
			password: $password,
			password_confirm: $password_confirm,
			vcode: $vcode,
			client: 'ios'
		},
		success: function(data) {

			if( data.code == 200 ) {				

				mui.openWindow({
					url: '../form/login.html',
					id: 'login',
					waiting: {
						autoShow: true
					}
				})
			} else if(datas.code == 400){
				console.log(data.datas.error);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
	
})

